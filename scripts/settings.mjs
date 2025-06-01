import { CONST } from "./const.mjs";
export function registerSettings(){
    game.settings.register(CONST.moduleName, 'combatColor', {
        name: 'OSRMUI.settings.combatColor',
        hint: 'OSRMUI.settings.combatColorHint',
        default: true,
        type: Boolean,
        scope: 'world',
        config: true
    })
    game.settings.register(CONST.moduleName, 'overrideColor', {
        name: 'OSRMUI.settings.overrideColor',
        hint: 'OSRMUI.settings.overrideColorHint',
        default: false,
        type: Boolean,
        scope: 'user',
        config: true
    })
    game.settings.register(CONST.moduleName, 'characterColor', {
        name: 'OSRMUI.settings.characterColor',
        hint: 'OSRMUI.settings.characterColorHint',
        default: 'red',
        type: String,
        choices: {
            'blue': 'OSRMUI.blue',
            'green': 'OSRMUI.green',
            'red': 'OSRMUI.red',
            'orange': 'OSRMUI.orange',
            'yellow': 'OSRMUI.yellow',
            'purple': 'OSRMUI.purple',
            'white': 'OSRMUI.white',
            'black': 'OSRMUI.black',
        },
        scope: 'user',
        config: true
    })
    game.settings.register(CONST.moduleName, 'monsterColor', {
        name: 'OSRMUI.settings.monsterColor',
        hint: 'OSRMUI.settings.monsterColorHint',
        default: 'blue',
        type: String,
        choices: {
            'blue': 'OSRMUI.blue',
            'green': 'OSRMUI.green',
            'red': 'OSRMUI.red',
            'orange': 'OSRMUI.orange',
            'yellow': 'OSRMUI.yellow',
            'purple': 'OSRMUI.purple',
            'white': 'OSRMUI.white',
            'black': 'OSRMUI.black',
        },
        scope: 'user',
        config: true
    })
}