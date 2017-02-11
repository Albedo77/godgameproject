//=============================================================================
// PD_8DirDash.js
//=============================================================================

/*:
 * @plugindesc Add to 8 direction move with graphic change.
 * @author Shio_inu
 *
 * @help 面倒なので誰か代わりに翻訳して。
 * last update : 18th dec 2015 v0.9
 */

/*:ja
 * @plugindesc グラフィック変更を伴う8方向移動機能が追加されるプラグインです。
 * @author しおいぬ
 *
 * @help ファイル名の末尾に「_Q」の文字列が含まれる歩行グラフィックを
 * 8方向グラフィックとして扱います。
 * 同様に、ファイル名の末尾に「_D」の文字列が含まれる
 * 歩行グラフィックをダッシュグラフィックとして、
 * ファイル名の末尾に「_QD」の文字列が含まれる歩行グラフィックを
 * 8方向+ダッシュグラフィックとして扱います。
 * last update : 2015/12/18 v0.9
 */
(function(){

    //PD_8DirDash.jsが存在するか（PD_AdjustCharaSprite.jsとの競合回避用）
    var PD_8DirDashiAvailable = true;


    Game_Player.prototype.getInputDirection = function() {
        return Input.dir8;
    };

    Game_Map.prototype.xWithDirection = function(x, d) {
        return x + ((d % 3) === 0 ? 1 : (d % 3) === 1 ? -1 : 0);
    };

    Game_Map.prototype.yWithDirection = function(y, d) {
        return y + (d <= 3 ? 1 : d >= 7 ? -1 : 0);
    };

    Game_Map.prototype.roundXWithDirection = function(x, d) {
        return this.roundX(x + ((d % 3) === 0 ? 1 : (d % 3) === 1 ? -1 : 0));
    };

    Game_Map.prototype.roundYWithDirection = function(y, d) {
        return this.roundY(y + (d <= 3 ? 1 : d >= 7 ? -1 : 0));
    };


    Sprite_Character.prototype.getAddX = function(d) {
        return ((d % 3) === 0 ? 1 : (d % 3) === 1 ? -1 : 0);
    };

    Sprite_Character.prototype.getAddY = function(d) {
        return (d <= 3 ? 1 : d >= 7 ? -1 : 0);
    };

    Sprite_Character.prototype.characterPatternX = function() {
        return this.shiftCharacterPatternX(0);
    };

    Sprite_Character.prototype.shiftCharacterPatternX = function(shift) {
        if(this._prevStopping){
            this._prevStopping = this._character.isStopping();
        }
        var fileName = this._characterName.substring(this._characterName.lastIndexOf( "_" ));
        if((fileName.indexOf("D") != -1) && this._character.isDashing() && !this._prevStopping){
            shift += 3;
        }
        this._prevStopping = this._character.isStopping();
        return this._character.pattern() + shift;
    };

    Sprite_Character.prototype.characterPatternY = function() {
        if(!this._prevDir){
            this._prevDir = 2;
        }
        var fileName = this._characterName.substring(this._characterName.lastIndexOf( "_" ));
        if((fileName.indexOf("Q") != -1) && (this._character.direction() % 2 != 0)){
            if(this._character.direction() < 5){
                return 4 + ((this._character.direction() - 1 ) / 2);
            } else {
                return 4 + ((this._character.direction() - 3 ) / 2);
            }
        }
        else{
            var i = 0;
            if(this._character.direction() % 2 != 0){
              if(this.getAddX(this._prevDir) === this.getAddX(this._character.direction()) * -1){
                  this._prevDir = this.reverseDirection(this._prevDir);
              } else if(this.getAddY(this._prevDir) === this.getAddY(this._character.direction()) * -1){
                  this._prevDir = this.reverseDirection(this._prevDir);
              }
              return (this._prevDir + i - 2) / 2;
            }
            this._prevDir = this._character.direction();
            return (this._character.direction() + i - 2) / 2;
        }
    };

    Sprite_Character.prototype.reverseDirection = function(dir) {
        switch (dir) {
        case 2:
            return 8;
        case 4:
            return 6;
        case 6:
            return 4;
        case 8:
            return 2;
        default:
            return 0;
        }
    };

    Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
        this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
        if (this.isMovementSucceeded()) {
            this._x = $gameMap.roundXWithDirection(this._x, horz);
            this._y = $gameMap.roundYWithDirection(this._y, vert);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
            this.increaseSteps();
        }
        var fileName = this._characterName.substring(this._characterName.lastIndexOf( "_" ));
        if(this._characterName.indexOf("Q") != -1){
            switch (vert + horz) {
            case 6:
                this.setDirection(1);
                break;
            case 8:
                this.setDirection(3);
                break;
            case 12:
                this.setDirection(7);
                break;
            case 14:
                this.setDirection(9);
                break;
            default:
                return 0;
            }
        }
        else{
            if (this._direction === this.reverseDir(horz)) {
                this.setDirection(horz);
            }
            if (this._direction === this.reverseDir(vert)) {
                this.setDirection(vert);
            }
        }
    };
})();