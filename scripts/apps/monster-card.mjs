import { CONST } from "../const.mjs";
import { OSRMUIBase } from "./osrmui-base.mjs";
import { utils } from "../util.mjs";

export class OSRActorCard extends OSRMUIBase {
  constructor(options) {
    super(options);
    this.actor = options.actor || null;
  }

  static DEFAULT_OPTIONS = {
    // id: 'monster-card-default',
    position: {
      width: 200,
      height: 300,
    },
    classes: ["osrmui", "osr-actor-card"],
    tag: "osrmui-app", // The default is "div"
    window: {
      icon: "fas fa-spaghetti-monster-flying", // You can now add an icon to the header
      title: "", //localization string
    },
    actions: {
      rollSave: OSRActorCard.rollSave,
      rollAttack: OSRActorCard.rollAttack,
      rollAbility: OSRActorCard.rollAbility,
      openMonsterSheet: OSRActorCard.openMonsterSheet,
      resetAttacks: OSRActorCard.resetAttacks,
      rollCheck: OSRActorCard.rollCheck,
    },
  };
  static PARTS = {
    main: {
      template: `modules/${CONST.moduleName}/templates/monster-card.hbs`,
    },
  };
  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    context = foundry.utils.mergeObject(context, {
      name: this.actor.name,
      image: this.actor.img,
      type: this.actor.type,
      data: this.actor.system,
      isMonster: this.actor.type === "monster",
    });
    return context;
  }
  async _onRender(context, options) {
    const el = this.element;
    if (
      this.actor.type == "character" &&
      !el.classList.contains("actor-card")
    ) {
      el.classList.add("actor-card");
    } else if (
      this.actor.type == "monster" &&
      !el.classList.contains("monster-card")
    ) {
      el.classList.add("monster-card");
    }
    this._setColorTheme();
    // popout accommodation
    if(game.modules.get('popout')?.active){
      // wait for popout control to render
      await utils.sleep(150);
      const header = this.element.querySelector('.window-header');
      const pButton = header.querySelector('.popout-module-button');
      pButton?.addEventListener('click', async (ev) => {
        ev.preventDefault();
        await utils.sleep(300);
        this.render();
      });
      
    }
    this._forceTabInit(context.tabs);

    const img = this.element.querySelector(".img");
    img.addEventListener("contextmenu", (ev) => {
      ev.preventDefault();
      this._selectActorToken();
    });
  }

  async _resetAttackCounters() {
    for (const item of this.actor.items) {
      if (item.type == "weapon") {
        await item.update({ "system.counter.value": item.system.counter.max });
      }
      this.render();
    }
  }
  _selectActorToken() {
    const token = game.scenes.current.tokens.find(
      (token) => token.actor.uuid === this.actor.uuid
    );
    if (token) {
      token.object.control();
    }
  }

  async _setColorTheme() {
    const el = this.element;
    const combatColor = game.settings.get(CONST.moduleName, 'combatColor');
    const overrideColor = game.settings.get(CONST.moduleName, 'overrideColor');
    const characterColor = game.settings.get(CONST.moduleName, 'characterColor');
    const monsterColor = game.settings.get(CONST.moduleName, 'monsterColor');
    if (combatColor && !overrideColor) {
      const combatData = game.combat?.getCombatantsByActor(this.actor.id)[0];
      if(!combatData){
        return;
      }
      const color = game.version >= 13 ? combatData.group.name : combatData.flags.ose.group;
      if (color) {
        el.style.setProperty("--glow-color", `var(--glow-${color})`);
        el.style.setProperty("--gradient-color-a", `var(--group-color-${color})`);
        el.style.setProperty("--btn-hover", `var(--group-d-color-${color})`);
        if(this.actor.type == 'character'){
          el.style.setProperty("--stat-bar-txt", `var(--group-d-color-${color})`);
        }
      }
    } else {
      if (this.actor.type == "character") {
        el.style.setProperty("--glow-color", `var(--glow-${characterColor})`);
        el.style.setProperty("--gradient-color-a", `var(--group-color-${characterColor})`);
        el.style.setProperty("--btn-hover", `var(--group-d-color-${characterColor})`);
        el.style.setProperty("--stat-bar-txt", `var(--group-d-color-${characterColor})`);
      } else if (this.actor.type == "monster") {
        el.style.setProperty("--glow-color", `var(--glow-${monsterColor})`);
        el.style.setProperty("--gradient-color-a", `var(--group-color-${monsterColor})`);
        el.style.setProperty("--btn-hover", `var(--group-d-color-${monsterColor})`);
      }
    }
  }
  static rollSave(ev) {
    const el = ev.target.closest(".save-row");
    if (ev.shiftKey) {
      this.actor.rollSave(el.dataset.save, { fastForward: true });
    } else {
      this.actor.rollSave(el.dataset.save);
    }
  }
  static async rollAttack(ev) {
    const el = ev.target.closest(".ability-icon.attack");
    const item = this.actor.items.find((item) => item.uuid === el.dataset.uuid);
    const count = item.system.counter.value || null;
    const cardId = this.actor.uuid;
    if (count > 0 || this.actor.type == "character") {
      if (ev.shiftKey) {
        await item.rollWeapon({ skipDialog: true });
        const newCount = count - 1;
        await item.update({ "system.counter.value": newCount });
        this.render();
        foundry.applications.instances.get(`monster-card-${cardId}`).render();
      } else {
        const retVal = await item.rollWeapon(item);
        Hooks.once("createChatMessage", async (obj, a, id) => {
          if (
            obj.flags?.ose?.roll == "attack" &&
            obj.flags?.ose?.itemId == item.id
          ) {
            const newCount = count - 1;
            await item.update({ "system.counter.value": newCount });
            foundry.applications.instances
              .get(`monster-card-${cardId}`)
              .render();
          }
        });
      }
    } else {
      ui.notifications.warn("No more attacks");
      return;
    }
  }
  static rollAbility(ev) {
    const el = ev.target.closest(".ability-icon.ability");
    const item = this.actor.items.find((item) => item.uuid === el.dataset.uuid);
    if (ev.shiftKey) {
      item.sheet.render(true);
    } else {
      item.roll();
    }
  }
  static openMonsterSheet(ev) {
    this.actor.sheet.render(true);
  }
  static resetAttacks(ev) {
    this._resetAttackCounters();
  }
  static rollCheck(ev) {
    const el = ev.target.closest(".ability-row");
    const ability = el.dataset.ability;
    const shiftKey = ev.shiftKey;
    this.actor.rollCheck(ability, { fastForward: shiftKey });
  }
}
