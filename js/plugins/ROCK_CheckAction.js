//=============================================================================
// ROCK_CheckAction.js
// Version: 0.1
//----------------------------------------------------------------------------
// Copyright (c) 2016 ROCK3
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc In execution key, the event to be executed.
 * @author ROCK3
 *
 * @param CommonEventId
 * @desc Common Event ID
 * @default 1
 *
 * @help In execution key, the event to be executed. 
 * This plugin does not provide plugin commands.
 *
 */
/*:ja
 * @plugindesc 決定キーで実行するイベントが無い場合にコモンイベントを呼ぶプラグイン
 * @author ROCK3
 *
 * @param CommonEventId
 * @desc 決定キーで呼ぶコモンイベントIDを指定する
 * @default 1
 *
 * @help 決定キーで、実行するイベントが、無い場合にコモンイベントを、呼ぶプラグイン。
 * このプラグインには、プラグインコマンドはありません。
 */

(function() {
	var parameters = PluginManager.parameters('ROCK_CheckAction');
	var cmnEvId = Number(parameters['CommonEventId'] );

	var _Game_Player_prototype_triggerAction = Game_Player.prototype.triggerAction;
	Game_Player.prototype.triggerAction = function(){
		var ret = _Game_Player_prototype_triggerAction.call(this);
		if(ret == false){
		    if (Input.isTriggered('ok')) {
				$gameTemp.reserveCommonEvent(cmnEvId);
			}
		}
	}
})();

