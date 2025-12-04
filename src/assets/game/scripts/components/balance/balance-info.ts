import gc from "@sg/game-client-base";
import { _decorator, Label, tween, Vec3 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { truncateFixedDecimalsWithConfig } from "db://shared-components/shared/utils";
import Observer from "observer";
import { BalanceInfoHandler } from "./balance-info-handler";
const { ccclass, property } = _decorator;
const { render } = Observer;
const { Player } = gc;
const { MainPlayerStore } = Player;

@ccclass
export class BalanceInfo extends ObserverComponent {
    @property(Label)
    lblBalance: Label = null;

    @property(Label)
    lblName: Label = null;

    @render(BalanceInfoHandler, (store) => store.balance)
    setBalance(value: number) {
        this.lblBalance && (this.lblBalance.string = truncateFixedDecimalsWithConfig(value));
        tween(this.lblBalance.node)
            .to(0.1, { scale: new Vec3(0.55, 0.55, 1) })
            .to(0.1, { scale: new Vec3(0.5, 0.5, 1) })
            .start();
    }

    @render(MainPlayerStore, (store) => store.name)
    setName(text: string) {
        this.lblName && (this.lblName.string = text);
    }
}
