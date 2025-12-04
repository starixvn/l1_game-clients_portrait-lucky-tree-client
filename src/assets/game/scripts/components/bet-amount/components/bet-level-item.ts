import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { formatCurrencyWithConfig } from "db://shared-components/shared/utils";
import Observer from "observer";
import { BetAmountHandlers } from "../bet-amount-handlers";

const { ccclass, property } = _decorator;
const { handle } = Observer;

@ccclass
export default class BetLevelItem extends ObserverComponent {
    @property(Label)
    lblBet: Label = null;

    @property(Node)
    nodeSelectedBg: Node = null;

    private currentBetLevel = 0;

    @handle(BetAmountHandlers, (handler, amount: number) => handler.updateBetAmount(amount))
    onClickBetItem() {
        this.playSoundClick();
        return +this.currentBetLevel;
    }

    setData(betLevel: number) {
        this.currentBetLevel = betLevel;
        this.lblBet.string = formatCurrencyWithConfig(betLevel);
    }

    setSelectedNode(isSelected: boolean) {
        this.nodeSelectedBg.active = isSelected;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
