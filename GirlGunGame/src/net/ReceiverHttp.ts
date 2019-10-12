import BaseHttp from "../core/net/BaseHttp";
import App from "../core/App";
import Game from "../game/Game";
import Session from "../main/Session";
import LogType from "../core/manager/LogType";

/*
* name;
*/
export default class ReceiverHttp extends BaseHttp {
    constructor(hand:Laya.Handler) {
        super(hand);
    }

    static create(hand:Laya.Handler): ReceiverHttp {
        return new ReceiverHttp(hand);
    }

    send(): void {
        super.send(App.serverIP + "gamex3/gamedata","skey=" + Session.SKEY, "post", "text");
    }

    onSuccess(data): void {
        App.sdkManager.log(LogType.LOGIN_SUCCESS);
        Session.parseData(data);
        super.onSuccess(data);
        console.log("receive data",data);
    }
}