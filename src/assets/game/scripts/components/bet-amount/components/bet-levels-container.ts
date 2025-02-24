import gc from "@sg/game-client-base";
import { _decorator, instantiate, Layout, Node, Prefab, UITransform, v3 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import BetLevelItem from "./bet-level-item";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class BetLevelsContainer extends ObserverComponent {
    @property(Node)
    content: Node = null;

    @property(Prefab)
    prfBetLevelItem: Prefab = null;

    private betLevels: number[] = [];
    private readonly itemHeight = 60;
    private readonly itemsOfColumnMax = 5;
    private readonly itemsAlignCenterMax = 15;

    setBetLevels(betLevels: number[]) {
        if (betLevels.length <= 0) {
            return;
        }
        betLevels.sort((a, b) => a - b);
        this.betLevels = betLevels;
        this.initBetLevelItems();
        this.calculateContainerHeight();
        this.content.getComponent(Layout).updateLayout();
    }

    initBetLevelItems() {
        this.betLevels.forEach((value) => {
            const node = instantiate(this.prfBetLevelItem);
            this.content.addChild(node);

            const itemComp = node.getComponent(BetLevelItem);
            itemComp.setData(value);
        });
    }

    private calculateContainerHeight() {
        let height = 0;
        if (this.betLevels.length >= this.itemsOfColumnMax) {
            height = this.itemsOfColumnMax * this.itemHeight + (this.itemsOfColumnMax + 1) * 10;
        } else {
            height = this.betLevels.length * this.itemHeight + (this.betLevels.length + 1) * 10;
        }

        if (this.betLevels.length > this.itemsAlignCenterMax) {
            this.node.position = v3(100, 0, 0);
        } else {
            this.node.position = v3(0, 0, 0);
        }

        this.content.getComponent(UITransform).height = height;
    }

    @render(gc.Bet.BetStore, (store) => store.amount)
    renderBetAmount(betAmount: number) {
        if (this.content.children.length <= 0) {
            return;
        }
        this.content.children.forEach((child) => {
            child.getComponent(BetLevelItem).setSelectedNode(false);
        });
        const index = this.betLevels.findIndex((amount) => amount === betAmount);
        const selectedNode = this.content.children[index];
        const comp = selectedNode.getComponent(BetLevelItem);
        comp.setSelectedNode(true);
    }
}
