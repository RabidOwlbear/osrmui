const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class OSRMUIBase extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options) {
    super(options);
  }

  static DEFAULT_OPTIONS = {
    // id: 'osrmui-base',
    position: {
      width: 200,
      height: 400
    },
    classes: ['osrmui'],
    tag: 'osrmui-app', // The default is "div"
    // tabs: [{ navSelector: '.tabs', contentSelector: '.sheet-body', initial: 'main' }],
    window: {
      icon: 'fas fa-shield', // You can now add an icon to the header
      title: '' //localization string
    },
    // dragDrop: [{ dragSelector: '[data-drag]', dropSelector: '.drop' }],
    actions: {
     
    }
  };
  static PARTS = {
    main: {
      template: 'modules/osr-helper-v2/templates/'
    }
  };
  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    context = foundry.utils.mergeObject(context, {});

    return context;
  }
  _onRender(context, options) {
    this._forceTabInit(context.tabs);
  }
  _getTabs(parts, tabs = ['main']) {
    const tabGroup = 'primary';
    const intialTab = this.options.tabs[0].initial;
    const tabData = {};
    // Default tab for first time it's rendered this session
    if (!this.tabGroups.primary) this.tabGroups.primary = intialTab;
    for (let part of parts) {
      const tab = {
        cssClass: '',
        group: tabGroup,
        // Matches tab property to
        id: '',
        // FontAwesome Icon, if you so choose
        icon: '',
        // Run through localization
        label: ''
      };
      //move to constructor
     
      switch (part) {
        case 'main':
          tab.id = 'main';
          tab.label += 'main';
          break;
      }
      // This is what turns on a single tab
      if (this.tabGroups[tabGroup] === tab.id) tab.cssClass = 'active';
      if (tabs.includes(part)) {
        tabData[part] = tab;
      }
    }
    return tabData;
  }
  _forceTabInit(tabData) {
    const tabEls = [...this.element.querySelectorAll('.tab')];
    const tabInitialized = tabEls.filter((i) => i.classList.contains('active')).length > 0;
    if (!tabInitialized) {
      for (let property in tabData) {
        if (tabData[property]?.cssClass === 'active') {
          const tabId = tabData[property].id;
          const tabEl = tabEls.find((i) => i.classList.contains(tabId));
          if (tabEl && !tabEl.classList.contains('active')) {
            tabEl.classList.add('active');
          }
        }
      }
    }
  }
  
}
