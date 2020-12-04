class DemoSkill1 extends IL1Skill{
    protected skillTargetFind(): Array<L1Char> {
        return [this.char];
    }
    protected skillConfig(): void {
        let tl = this.timeLine;
        tl[0] = ()=>{ // 第0ms开始执行
            this.char.startAnim([[0, 0], [0, 10], [0, -10], [0, 0]], [75, 150, 75]);
        }
        tl[75] = ()=>{ // 第75ms执行
            this.char.curHp += 100;
        }
        tl[225] = ()=>{
            this.char.curHp += 100;
        }
        tl[300] = ()=>{
            this.char.curHp += 100;
        }
    }
    
}

class NormalAttakSkill extends IL1Skill{
    protected skillTargetFind(): Array<L1Char> {
        return [this.char.normalAttakTarget];
    }

    protected skillConfig(): void {
        let tl = this.timeLine = {};
        tl[0] = ()=>{ // 第0ms开始执行
            this.char.startAnim([[0, 0], [10, 0], [-5, 0], [0, 0]], [75, 100, 50]);
        }
        tl[75] = ()=>{ // 第75ms执行
            this.targets[0].curHp -= 100;
        }
    }

}