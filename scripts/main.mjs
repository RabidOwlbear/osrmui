import { CONST } from "./const.mjs";
import { OSRActorCard } from "./apps/monster-card.mjs";
import { utils } from "./util.mjs";
import { registerSettings } from "./settings.mjs";



Hooks.on("ready", () => {
    console.log(CONST.consoleLogo);
    registerSettings();
});

Hooks.on("renderTokenHUD", (app, html, data) => {
  let colRight;
  let colLeft;
  const popout = game.modules.get('popout')?.active || false;
  const actor = app?.object?.actor;
  const iconClass = actor.type === 'monster' ? 'fa-spaghetti-monster-flying' : 'fa-user';
  const tooltip = actor.type === 'monster' ? game.i18n.localize('OSRMUI.openMonsterCard') : game.i18n.localize('OSRMUI.openActorCard');
  if(actor.isOwner){
    if (game.version>=13){  
      colRight = html?.querySelector(".col.right");
       colLeft = html?.querySelector(".col.left");    
    }else{
      colRight = html?.find(".col.right")[0];
       colLeft = html?.find(".col.left")[0];     
    }
    const btn = document.createElement('button');
    btn.dataset.tooltip = tooltip;
    btn.classList.add('btn', 'control-icon');
    btn.id = `monster-card-btn`;
    const icon = document.createElement('i');
    icon.classList.add('fas', iconClass);
    btn.appendChild(icon);
    colLeft.appendChild(btn);
    btn.addEventListener('click', async (ev) => {
      console.log('click',ev, ev.target)
      const buttonEl = ev.target.closest('#monster-card-btn');  
      if(buttonEl){
      ev.preventDefault();
      utils.openCard(ev);
     
    }
    });
    
  }
  
});
