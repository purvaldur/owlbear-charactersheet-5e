<script lang="ts">
  // A new character's guided setup, in the dialog popover: its name and rules, then species, class and level, subclass,
  // background, ability scores, the choices those ask for, starting equipment, and a look at the result. Each SRD step
  // can be Custom instead, for something the SRD doesn't have, with a name of its own. Create sends the finished sheet
  // to the Codex.
  import { ABILITIES, ABILITY, RULESETS, SKILLS } from "../../lib/model/defaults";
  import { srdUrl, type SrdItem, type SrdSpell } from "../../lib/model/srd";
  import type { AbilityKey, Rules, Sheet } from "../../lib/model/types";
  import { activeChoices, armorClass, blankPicks, blocked, buildCharacter, choiceFrom, chosen, finalScores, grantedProficiencies, hitPoints, proficientSkills, subtitle } from "../../lib/setup/build";
  import { POINT_BUY_BUDGET, POINT_COST, STANDARD_ARRAY } from "../../lib/setup/tables";
  import type { ActiveChoice } from "../../lib/setup/build";
  import type { ScoreMethod, SetupPicks, SrdSetup } from "../../lib/setup/types";
  import Icon from "../../components/Icon.svelte";

  let { focus = 0, size, oncreate, onclose }: {
    focus?: number;
    size: { max: () => number; set: (height: number) => void };
    oncreate: (sheet: Sheet) => void;
    onclose: () => void;
  } = $props();

  type Step = "core" | "species" | "class" | "subclass" | "background" | "abilities" | "choices" | "equipment" | "review";
  const LABELS: Record<Step, string> = {
    core: "Core", species: "Species", class: "Class", subclass: "Subclass", background: "Background", abilities: "Abilities",
    choices: "Choices", equipment: "Equipment", review: "Review",
  };

  let setup = $state.raw<SrdSetup | null>(null);
  let items = $state.raw<SrdItem[]>([]);
  let spells = $state.raw<SrdSpell[]>([]);
  let failed = $state(false);
  let picks = $state<SetupPicks>(blankPicks());
  let step = $state<Step>("core");
  /** The standard array's values, by the ability each is placed in. */
  let placed = $state<Partial<Record<AbilityKey, number>>>({});
  /** 2024 background increases: +2 and +1, or +1 to each of three. */
  let spread = $state<"2-1" | "1-1-1">("2-1");
  let body: HTMLDivElement | undefined = $state();
  const edition = $derived(RULESETS.find(([k]) => k === picks.rules)!);

  // Always as tall as the popover gets, as the SRD lists are.
  $effect(() => size.set(size.max()));
  $effect(() => {
    if (focus) body?.querySelector<HTMLElement>("input, select, button")?.focus();
  });

  // On the URLs: the Codex sends the popover its dialog again with every change, which mustn't load the SRD again.
  const setupUrl = $derived(srdUrl("setup", picks.rules));
  const itemsUrl = $derived(srdUrl("items", picks.rules));
  const spellsUrl = $derived(srdUrl("spells", picks.rules));
  $effect(() => {
    failed = false;
    setup = null;
    const load = (url: string) => fetch(url).then((r) => r.json());
    Promise.all([load(setupUrl), load(itemsUrl), load(spellsUrl)])
      .then(([s, i, sp]: [SrdSetup, SrdItem[], SrdSpell[]]) => {
        setup = s;
        items = i;
        spells = sp;
      })
      .catch(() => (failed = true));
  });

  const c = $derived(setup ? chosen(setup, picks) : null);
  const active = $derived(setup ? activeChoices(setup, picks) : []);
  const scores = $derived(setup ? finalScores(setup, picks) : picks.scores);
  const steps = $derived.by((): Step[] => {
    const s: Step[] = ["core", "species", "class"];
    if (c?.klass && picks.level >= c.klass.subclassLevel) s.push("subclass");
    s.push("background", "abilities");
    if (active.some((a) => !a.given)) s.push("choices");
    if (c?.klass?.equipment.length || c?.background?.equipment.length) s.push("equipment");
    s.push("review");
    return s;
  });
  const at = $derived(steps.indexOf(step));
  const go = (s: Step) => {
    step = s;
    body?.scrollTo?.({ top: 0 });
  };
  const next = () => at < steps.length - 1 && go(steps[at + 1]!);
  const back = () => at > 0 && go(steps[at - 1]!);
  // A step that drops out (lower level, no choices left) hands over to the one before it.
  $effect(() => {
    if (!steps.includes(step)) step = steps[Math.max(0, at - 1)] ?? "core";
  });

  const signed = (n: number) => (n < 0 ? `−${-n}` : `+${n}`);
  const mod = (n: number) => Math.floor((n - 10) / 2);
  const increaseText = (g: Partial<Record<AbilityKey, number>> | undefined) =>
    Object.entries(g ?? {}).map(([k, n]) => `${signed(n ?? 0)} ${ABILITY[k as AbilityKey].short}`).join(", ");

  /** Another edition's SRD has other species and classes, so everything but the name starts over. */
  function setRules(r: Rules) {
    if (r === picks.rules) return;
    picks = { ...blankPicks(r), name: picks.name };
    placed = {};
    spread = "2-1";
  }

  /** Forgets the choices (and equipment picks) of steps whose pick changed, so nothing carries over to the next one. */
  function forget(...prefixes: string[]) {
    const stale = (k: string) => prefixes.some((p) => k.startsWith(`${p}/`));
    picks.choices = Object.fromEntries(Object.entries(picks.choices).filter(([k]) => !stale(k)));
    picks.equipment = Object.fromEntries(Object.entries(picks.equipment).filter(([k]) => !stale(k)));
  }
  function pickSpecies(name: string | null) {
    if (name !== picks.species) forget("species", "subspecies");
    picks.species = name;
    picks.subspecies = null;
  }
  function pickSubspecies(name: string | null) {
    if (name !== picks.subspecies) forget("subspecies");
    picks.subspecies = name;
  }
  function pickClass(name: string | null) {
    if (name !== picks.class) forget("class", "subclass");
    picks.class = name;
    picks.subclass = null;
  }
  function pickSubclass(name: string | null) {
    if (name !== picks.subclass) forget("subclass");
    picks.subclass = name;
  }
  /** Another background has other abilities to increase, so its increases start over too. */
  function pickBackground(name: string | null) {
    if (name !== picks.background) {
      forget("background", "feat");
      picks.increases = {};
      spread = "2-1";
    }
    picks.background = name;
  }

  // ---------- Ability scores ----------
  function setMethod(m: ScoreMethod) {
    picks.method = m;
    if (m === "pointbuy") picks.scores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    if (m === "array") {
      placed = {};
      picks.scores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    }
  }
  function place(k: AbilityKey, value: string) {
    const v = value ? +value : undefined;
    for (const [other, ov] of Object.entries(placed)) if (ov === v && other !== k) delete placed[other as AbilityKey];
    placed[k] = v;
    for (const [a] of ABILITIES) picks.scores[a] = placed[a] ?? 10;
  }
  const spent = $derived(ABILITIES.reduce((n, [k]) => n + (POINT_COST[picks.scores[k]] ?? 0), 0));
  function buy(k: AbilityKey, d: number) {
    const v = picks.scores[k] + d;
    if (v < 8 || v > 15 || spent - (POINT_COST[picks.scores[k]] ?? 0) + POINT_COST[v]! > POINT_BUY_BUDGET) return;
    picks.scores[k] = v;
  }
  function setIncrease(k: AbilityKey, n: number) {
    const inc = { ...picks.increases };
    for (const [other, on] of Object.entries(inc)) if (on === n && spread === "2-1") delete inc[other as AbilityKey];
    if (inc[k] === n) delete inc[k];
    else inc[k] = n;
    picks.increases = inc;
  }
  function setSpread(s: "2-1" | "1-1-1") {
    spread = s;
    picks.increases = s === "1-1-1" ? Object.fromEntries((c?.background?.abilityChoice ?? []).map((k) => [k, 1])) : {};
  }

  // ---------- Choices ----------
  // What counts as picked (stale picks left out), so toggling never brings one back.
  const picked = (a: ActiveChoice) => a.picked;
  function toggle(a: ActiveChoice, value: string, on: boolean) {
    const now = picked(a);
    if (a.choice.kind === "option" || a.choice.count === 1) picks.choices[a.key] = on ? [value] : [];
    else picks.choices[a.key] = on ? [...now, value].slice(0, a.choice.count) : now.filter((v) => v !== value);
  }
  /** Skills, tools and languages granted outright, which no choice can pick again. */
  const granted = $derived(setup ? grantedProficiencies(setup, picks) : { skills: new Set<string>(), tools: new Set<string>(), languages: new Set<string>() });
  /** The proficiencies picked in each choice, so another choice of the same kind can't pick them too. */
  // Expertise only clashes with other expertise (it picks skills you're proficient in, picked elsewhere on purpose).
  const group = (kind: string) => (kind === "expertise" ? "expertise" : ["skill", "tool", "language", "proficiency", "spell"].includes(kind) ? "proficiency" : null);
  function pickedElsewhere(a: ActiveChoice) {
    const out = new Set<string>();
    const g = group(a.choice.kind);
    if (!g) return out;
    for (const other of active) if (other.key !== a.key && group(other.choice.kind) === g) for (const v of picked(other)) out.add(v.toLowerCase());
    return out;
  }
  /** Whether a value is already had (granted) for a choice of this kind; skills and tools both for a "proficiency" choice. */
  function had(kind: string, v: string) {
    const l = v.toLowerCase();
    if (kind === "skill") return granted.skills.has(l);
    if (kind === "tool") return granted.tools.has(l);
    if (kind === "language") return granted.languages.has(l);
    if (kind === "proficiency") return granted.skills.has(l) || granted.tools.has(l);
    return false;
  }
  const proficient = $derived(setup ? proficientSkills(setup, picks) : []);
  const choiceLabel = (a: ActiveChoice) =>
    a.choice.kind === "ability" || a.choice.kind === "casting" ? (v: string) => ABILITY[v as AbilityKey].long : (v: string) => v;
  /** The choices to ask: not those answered already ("Magic Initiate (Cleric)" has its list). */
  const asked = $derived(active.filter((a) => !a.given));

  // ---------- Result ----------
  const preview = $derived(setup ? buildCharacter(setup, picks, items, spells) : null);
  const armor = $derived(setup && preview ? armorClass(setup, picks, preview) : null);
  const hp = $derived(c?.klass ? hitPoints(c.klass, picks.level, scores.con) : null);
  function create() {
    if (setup) oncreate(buildCharacter(setup, $state.snapshot(picks) as SetupPicks, items, spells));
  }
</script>

{#snippet customRow(name: string, current: string | null, onpick: () => void, hint: string)}
  <label class="pick">
    <input type="radio" {name} checked={current === null} onchange={onpick} />
    <span class="row-txt"><span class="row-nm">Custom</span><span class="row-meta">{hint}</span></span>
  </label>
{/snippet}

{#snippet customName(label: string, value: string, set: (v: string) => void, placeholder: string)}
  <label class="fld setup-custom"><span>{label}</span><input class="in" {value} oninput={(e) => set(e.currentTarget.value)} {placeholder} /></label>
{/snippet}

{#snippet coreStep()}
  <label class="fld"><span>Name</span><input class="in" bind:value={picks.name} placeholder="Character name" /></label>
  <div class="section-h">Rules</div>
  <div class="pk-list" role="radiogroup" aria-label="Rules">
    {#each RULESETS as [k, label, srd] (k)}
      <label class="pick">
        <input type="radio" name="rules" checked={picks.rules === k} onchange={() => setRules(k)} />
        <span class="row-txt"><span class="row-nm">{label}</span><span class="row-meta">Species, classes, backgrounds, spells and items from the {srd}</span></span>
      </label>
    {/each}
  </div>
{/snippet}

{#snippet speciesStep(s: SrdSetup)}
  <div class="pk-list" role="radiogroup" aria-label="Species">
    {@render customRow("species", picks.species, () => pickSpecies(null), "A species the SRD doesn't have")}
    {#each s.species as sp (sp.name)}
      <label class="pick">
        <input type="radio" name="species" checked={picks.species === sp.name} onchange={() => pickSpecies(sp.name)} />
        <span class="row-txt">
          <span class="row-nm">{sp.name}</span>
          <span class="row-meta">{[sp.grants.speed ? `Speed ${sp.grants.speed} ft.` : "", increaseText(sp.grants.abilities), sp.features.map((f) => f.name).join(", ")].filter(Boolean).join(" · ")}</span>
        </span>
      </label>
    {/each}
  </div>
  {#if picks.species === null}{@render customName("Your own species", picks.customSpecies, (v) => (picks.customSpecies = v), "Species name (optional)")}{/if}
  {#if c?.species?.subspecies.length}
    <div class="section-h">{c.species.name} subspecies</div>
    <div class="pk-list" role="radiogroup" aria-label="Subspecies">
      <label class="pick">
        <input type="radio" name="subspecies" checked={picks.subspecies === null} onchange={() => pickSubspecies(null)} />
        <span class="row-txt"><span class="row-nm">None</span><span class="row-meta">No subspecies</span></span>
      </label>
      {#each c.species.subspecies as sub (sub.name)}
        <label class="pick">
          <input type="radio" name="subspecies" checked={picks.subspecies === sub.name} onchange={() => pickSubspecies(sub.name)} />
          <span class="row-txt"><span class="row-nm">{sub.name}</span><span class="row-meta">{[increaseText(sub.grants.abilities), sub.features.map((f) => f.name).join(", ")].filter(Boolean).join(" · ")}</span></span>
        </label>
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet classStep(s: SrdSetup)}
  <div class="setup-level">
    <label class="fld"><span>Level</span>
      <input class="in num" type="number" min="1" max="20" value={picks.level} onchange={(e) => (picks.level = Math.min(20, Math.max(1, Math.trunc(+e.currentTarget.value) || 1)))} />
    </label>
    {#if hp != null}<span class="calc">{hp} hit points at level {picks.level}, before species bonuses</span>{/if}
  </div>
  {#if picks.class === null}
    <div class="setup-pair">
      {@render customName("Your own class", picks.customClass, (v) => (picks.customClass = v), "Class name (optional)")}
      {@render customName("Its subclass", picks.customSubclass, (v) => (picks.customSubclass = v), "Subclass name (optional)")}
    </div>
  {/if}
  <div class="pk-list" role="radiogroup" aria-label="Class">
    {@render customRow("class", picks.class, () => pickClass(null), "A class the SRD doesn't have")}
    {#each s.classes as k (k.name)}
      <label class="pick">
        <input type="radio" name="class" checked={picks.class === k.name} onchange={() => pickClass(k.name)} />
        <span class="row-txt">
          <span class="row-nm">{k.name}</span>
          <span class="row-meta">{[`d${k.hitDie}`, k.caster ? `${k.caster === "pact" ? "Pact Magic" : k.caster === "full" ? "Spellcaster" : "Half caster"} (${ABILITY[k.castingAbility!].short})` : "", `Saves ${k.grants.saves?.map((a) => ABILITY[a].short).join(", ")}`, `Subclass at level ${k.subclassLevel}`].filter(Boolean).join(" · ")}</span>
        </span>
      </label>
    {/each}
  </div>
{/snippet}

{#snippet subclassStep()}
  <div class="pk-list" role="radiogroup" aria-label="Subclass">
    {@render customRow("subclass", picks.subclass, () => pickSubclass(null), "A subclass the SRD doesn't have")}
    {#each c?.klass?.subclasses ?? [] as sub (sub.name)}
      <label class="pick">
        <input type="radio" name="subclass" checked={picks.subclass === sub.name} onchange={() => pickSubclass(sub.name)} />
        <span class="row-txt">
          <span class="row-nm">{sub.name}</span>
          <span class="row-meta">{sub.features.filter((f) => (f.level ?? 1) <= picks.level).map((f) => f.name).join(", ")}</span>
        </span>
      </label>
    {/each}
  </div>
  {#if picks.subclass === null}{@render customName("Your own subclass", picks.customSubclass, (v) => (picks.customSubclass = v), "Subclass name (optional)")}{/if}
{/snippet}

{#snippet backgroundStep(s: SrdSetup)}
  <div class="pk-list" role="radiogroup" aria-label="Background">
    {@render customRow("background", picks.background, () => pickBackground(null), "A background the SRD doesn't have")}
    {#each s.backgrounds as b (b.name)}
      <label class="pick">
        <input type="radio" name="background" checked={picks.background === b.name} onchange={() => pickBackground(b.name)} />
        <span class="row-txt">
          <span class="row-nm">{b.name}</span>
          <span class="row-meta">{[b.grants.skills?.join(", "), b.grants.tools?.join(", "), b.feat ? `Feat: ${b.feat}` : "", b.abilityChoice ? `Increases: ${b.abilityChoice.map((a) => ABILITY[a].short).join(", ")}` : ""].filter(Boolean).join(" · ")}</span>
        </span>
      </label>
    {/each}
  </div>
  {#if picks.background === null}{@render customName("Your own background", picks.customBackground, (v) => (picks.customBackground = v), "Background name (optional)")}{/if}
{/snippet}

{#snippet abilitiesStep()}
  <div class="lvl-chips" role="group" aria-label="How to set ability scores">
    {#each [["array", "Standard array"], ["pointbuy", "Point buy"], ["manual", "Manual"]] as const as [m, label] (m)}
      <button aria-pressed={picks.method === m} onclick={() => setMethod(m)}>{label}</button>
    {/each}
  </div>
  <p class="calc setup-hint">
    {#if picks.method === "array"}Place {STANDARD_ARRAY.join(", ")}, one in each ability.
    {:else if picks.method === "pointbuy"}{POINT_BUY_BUDGET - spent} of {POINT_BUY_BUDGET} points left. Scores go from 8 to 15.
    {:else}Type the scores you rolled or were given.{/if}
  </p>
  <div class="setup-scores">
    {#each ABILITIES as [k, short, long] (k)}
      <div class="setup-score">
        <span class="lbl" title={long}>{short}</span>
        {#if picks.method === "array"}
          <select class="in" aria-label="{long} score" value={placed[k] ?? ""} onchange={(e) => place(k, e.currentTarget.value)}>
            <option value="">–</option>
            {#each STANDARD_ARRAY as v (v)}<option value={v}>{v}</option>{/each}
          </select>
        {:else if picks.method === "pointbuy"}
          <span class="qty">
            <button aria-label="Lower {long}" onclick={() => buy(k, -1)}><Icon name="minus" size="sm" /></button>
            <span class="num">{picks.scores[k]}</span>
            <button aria-label="Raise {long}" onclick={() => buy(k, 1)}><Icon name="plus" size="sm" /></button>
          </span>
        {:else}
          <input class="in num" type="number" min="1" max="30" aria-label="{long} score" value={picks.scores[k]} onchange={(e) => (picks.scores[k] = Math.min(30, Math.max(1, Math.trunc(+e.currentTarget.value) || 10)))} />
        {/if}
        <span class="calc">{scores[k]} ({signed(mod(scores[k]))})</span>
      </div>
    {/each}
  </div>
  {#if c?.background?.abilityChoice}
    {@const bg = c.background}
    <div class="section-h">{bg.name} increases</div>
    <div class="lvl-chips" role="group" aria-label="How to spread the increases">
      <button aria-pressed={spread === "2-1"} onclick={() => setSpread("2-1")}>+2 and +1</button>
      <button aria-pressed={spread === "1-1-1"} onclick={() => setSpread("1-1-1")}>+1 to all three</button>
    </div>
    {#if spread === "2-1"}
      <div class="setup-incs">
        {#each [2, 1] as n (n)}
          <div role="radiogroup" aria-label="+{n}">
            <span class="calc">+{n}</span>
            {#each bg.abilityChoice ?? [] as k (k)}
              <label class="check"><input type="radio" name="inc-{n}" checked={picks.increases[k] === n} onchange={() => setIncrease(k, n)} />{ABILITY[k].long}</label>
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  {:else if c?.species && (c.species.grants.abilities || c.subspecies?.grants.abilities)}
    <p class="calc setup-hint">{[c.species, c.subspecies].filter(Boolean).map((e) => `${e!.name}: ${increaseText(e!.grants.abilities)}`).filter((t) => !t.endsWith(": ")).join(" · ")} (included above)</p>
  {/if}
{/snippet}

{#snippet choicesStep(s: SrdSetup)}
  {#each asked as a (a.key)}
    {@const from = choiceFrom(s, a.choice, proficient, spells)}
    {@const now = picked(a)}
    {@const full = now.length >= a.choice.count}
    {@const label = choiceLabel(a)}
    {@const elsewhere = pickedElsewhere(a)}
    <div class="section-h">{a.source}: {a.choice.label}<span class="grow"></span><span class="slot-lbl">{now.length} of {a.choice.count}</span></div>
    {#if a.choice.kind === "option"}
      <div class="pk-list" role="radiogroup" aria-label={a.choice.label}>
        {#each a.choice.options ?? [] as o (o.name)}
          {@const why = setup ? blocked(setup, picks, a.choice, o.name) : null}
          <label class="pick" class:owned={!!why} title={why ?? undefined}>
            <input type="radio" name={a.key} checked={now.includes(o.name)} disabled={!!why} onchange={() => toggle(a, o.name, true)} />
            <span class="row-txt"><span class="row-nm">{o.name}</span><span class="row-meta">{o.desc}</span></span>
          </label>
        {/each}
      </div>
    {:else}
      <div class="setup-checks" role="group" aria-label={a.choice.label}>
        {#each from as v (v)}
          {@const on = now.includes(v)}
          <!-- Had already (granted) shows ticked; picked in another choice shows greyed, so nothing is picked twice. -->
          {@const have = a.choice.kind !== "expertise" && had(a.choice.kind, v)}
          {@const other = !on && elsewhere.has(v.toLowerCase())}
          {@const why = setup ? blocked(setup, picks, a.choice, v) : null}
          <!-- A ticked box is never disabled, so a pick that became redundant can still be unticked. -->
          <label class="check" class:dim={have || other || !!why} title={why ?? (other ? "Picked in another choice" : have ? "Already proficient" : undefined)}>
            <input type="checkbox" checked={on || have} disabled={!on && (have || other || !!why || full)} onchange={(e) => toggle(a, v, e.currentTarget.checked)} />{label(v)}
          </label>
        {/each}
        {#if a.choice.from === "proficient" && !from.length}<span class="calc">Pick skill proficiencies first.</span>{/if}
      </div>
    {/if}
  {/each}
{/snippet}

{#snippet equipmentStep()}
  {#each [["class", c?.klass], ["background", c?.background]] as const as [src, e] (src)}
    {#each e?.equipment ?? [] as g, i (i)}
      {@const key = `${src}/${i}`}
      <div class="section-h">{e!.name}{g.options.length > 1 ? `: choose one` : ""}</div>
      <div class="pk-list" role="radiogroup" aria-label="{e!.name} equipment">
        {#each g.options as o, j (j)}
          <label class="pick">
            <input type="radio" name={key} checked={(g.options[picks.equipment[key] ?? 0] ? (picks.equipment[key] ?? 0) : 0) === j} onchange={() => (picks.equipment[key] = j)} />
            <span class="row-txt">
              <span class="row-nm">{o.label ? `${o.label} ` : ""}{[...o.items.map((it) => `${it.qty > 1 ? `${it.qty} ` : ""}${it.name}`), o.gp ? `${o.gp} gp` : ""].filter(Boolean).join(", ")}</span>
            </span>
          </label>
        {/each}
      </div>
    {/each}
  {/each}
{/snippet}

{#snippet reviewStep(s: SrdSetup)}
  {#if preview}
    <dl class="profs setup-review">
      <div><dt>Name</dt><dd>{preview.name}</dd></div>
      <div><dt>Subtitle</dt><dd>{subtitle(s, picks)}</dd></div>
      <div><dt>Hit points</dt><dd>{preview.hp.max} · proficiency {signed(preview.prof)}</dd></div>
      <div><dt>Armor Class</dt><dd>{preview.ac} · {armor?.worn.length ? armor.worn.join(" and ") : "no armor"}</dd></div>
      <div><dt>Scores</dt><dd>{ABILITIES.map(([k, short]) => `${short} ${preview.abilities[k].score}${preview.abilities[k].save ? "*" : ""}`).join(" · ")}</dd></div>
      {#if preview.spellcasting}
        {@const slots = Object.entries(preview.slots).map(([l, x]) => `${x.max}×${l}`).join(", ")}
        <div><dt>Spellcasting</dt><dd>{ABILITY[preview.spellcasting.ab].long}{slots ? ` · slots ${slots}` : ""}{c?.klass?.caster ? ". Add your class's spells from the SRD spell list afterwards." : ""}</dd></div>
      {/if}
      {#if preview.spells.length}<div><dt>Spells</dt><dd>{preview.spells.map((sp) => sp.name).join(", ")}</dd></div>{/if}
      <div><dt>Skills</dt><dd>{SKILLS.filter(([k]) => preview.skills[k]).map(([k, l]) => `${l}${preview.skills[k] === 2 ? " (expertise)" : ""}`).join(", ") || "None"}</dd></div>
      {#each [["Armor", preview.proficiencies.armor], ["Weapons", preview.proficiencies.weapons], ["Tools", preview.proficiencies.tools], ["Languages", preview.proficiencies.languages]] as const as [l, list] (l)}
        {#if list.length}<div><dt>{l}</dt><dd>{list.join(", ")}</dd></div>{/if}
      {/each}
      <div><dt>Features</dt><dd>{preview.features.map((f) => f.name).join(", ")}</dd></div>
      {#if preview.inventory.items.length || preview.inventory.coins.gp}<div><dt>Equipment</dt><dd>{[...preview.inventory.items.map((i) => `${i.qty > 1 ? `${i.qty} ` : ""}${i.name}`), preview.inventory.coins.gp ? `${preview.inventory.coins.gp} gp` : ""].filter(Boolean).join(", ")}</dd></div>{/if}
    </dl>
    <p class="calc setup-hint">* proficient save. Everything can be changed on the sheet afterwards.</p>
  {/if}
{/snippet}

<div class="ed-page" role="dialog" aria-label="Guided character setup">
  <header class="ed-h pk-h">
    <div class="ed-title"><h2>{step === "core" ? "New character" : `New character: ${LABELS[step].toLowerCase()}`}</h2><span class="ed-who">{picks.name.trim() || "Unnamed"} · {edition[1]} ({edition[2]})</span></div>
    <nav class="setup-steps" aria-label="Setup steps">
      {#each steps as s, i (s)}
        <button aria-current={s === step ? "step" : undefined} class:done={i < at} onclick={() => go(s)}>{i + 1}. {LABELS[s]}</button>
      {/each}
    </nav>
  </header>
  <div class="ed-b setup-b" bind:this={body}>
    {#if step === "core"}{@render coreStep()}
    {:else if failed}
      <p class="log-empty">The SRD could not be loaded. Check your connection and try again.</p>
    {:else if !setup}
      <p class="log-empty">Loading the SRD…</p>
    {:else if step === "species"}{@render speciesStep(setup)}
    {:else if step === "class"}{@render classStep(setup)}
    {:else if step === "subclass"}{@render subclassStep()}
    {:else if step === "background"}{@render backgroundStep(setup)}
    {:else if step === "abilities"}{@render abilitiesStep()}
    {:else if step === "choices"}{@render choicesStep(setup)}
    {:else if step === "equipment"}{@render equipmentStep()}
    {:else}{@render reviewStep(setup)}{/if}
  </div>
  <footer class="ed-f">
    <button class="btn ghost" onclick={at === 0 ? onclose : back}>{at === 0 ? "Cancel" : "Back"}</button>
    <span class="grow calc">{setup ? subtitle(setup, picks) : ""}</span>
    {#if step === "review"}
      <button class="btn primary" disabled={!setup} onclick={create}><Icon name="check" size="sm" />Create character</button>
    {:else}
      <button class="btn primary" disabled={!setup && step !== "core"} onclick={next}>Next</button>
    {/if}
  </footer>
</div>
