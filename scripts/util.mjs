import { OSRActorCard } from "./apps/monster-card.mjs";
export const utils = {
  getApp: (id) => {
    const app = foundry.applications.instances.get(id);
    if(app){
      return app;
    }else{
      return null;
    }
  },
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  injectTokenUi: (actor) => {
    
  },
  openCard: async (ev) => {
    const initialPos = {
      top: ev.y - 150,
      left: ev.x + 95
    }
    
    for(let token of canvas.tokens.controlled){
      const actor = token.actor;
      const iconClass = actor.type === 'monster' ? 'fa-spaghetti-monster-flying' : 'fa-user';
      const cardOpen = utils.getApp(`monster-card-${actor.uuid}`);
      if(cardOpen){
        await utils.sleep(300);
        cardOpen.render();
      }else{
       await new OSRActorCard({ actor: actor, id: `monster-card-${actor.uuid}` }).render(true,{ 
          window: { title: actor.name,
            icon: `fas ${iconClass}`
          }, 
          position:{ top: initialPos.top, left: initialPos.left} 
        });
        initialPos.top += 5;
        initialPos.left += 20;
      }
    }
  }
}

