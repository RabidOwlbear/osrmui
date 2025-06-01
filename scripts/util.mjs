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
    
  }
}

