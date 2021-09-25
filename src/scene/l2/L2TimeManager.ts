class L2TimeManager{
    public globalTime: number = 0; // 当前已经走了多少时间
    private static SpeedM = 100;
    private static defBackTime = 50;

    public curChar: L2Char;

    private getAliveChars(): L2Char[]{
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let aliveChars = [];
        for(let char of scene.enemies.concat(scene.players)){
            if(char.alive){
                aliveChars.push(char);
            }
        }
        return aliveChars;
    }

    /**
     * 安排下一个角色开始行动，所有角色行动条会相应更新，全局时间也会变化
     */
    public toNextChar(): L2Char{
        // 找到游戏中时间最近的单位，如果存在重叠时间，选择权重最小的那个，如果权重一致随机选择一个
        let chars = this.getAliveChars();
        let sortChars = chars.sort((a, b)=>{return a.NowTime - b.NowTime;});
        let beforeCharTime = sortChars[0].NowTime;
        let selectChars: L2Char[] = [];
        for(let char of sortChars){
            if(char.NowTime != beforeCharTime){
                break;
            }
            selectChars.push(char);
        }
        let charSelectPiror = selectChars.sort((a, b)=>{return a.timePrior - b.timePrior}); // 倒序排列
        let selectChar = charSelectPiror[0];

        // 将该单位时间设置为 0 
        let timeShift = selectChar.NowTime;
        selectChar.setTime(0);

        // 所有角色跟新时间
        for(let char of sortChars){
            if(char != selectChar){
                char.setTime(char.NowTime - timeShift);
            }
        }
        
        // 跟新全局时间
        this.globalTime += timeShift;
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.mainUI.timePointLabel.text = `${this.globalTime}`;

        this.curChar = selectChar;
        // 返回该单位
        return selectChar;
    }

    /**
     * 正常完成动作以后相关时间管理
     */
    public afterCharNormalAction(): void{
        let char = this.curChar;
        if(char == null){console.error("不应该出现这种情况");return;}
        char.endAction();
        // 角色时间调整到默认回来的时间 * 角色speed所对应的加速
        let speed = char.attr.actionSpeed;
        let M = L2TimeManager.SpeedM;
        let defBackT = L2TimeManager.defBackTime
        char.setTime(Math.ceil(defBackT * (0.5 + 0.5 * speed/(speed + M))));
        // 如果存在时间重叠，则将该角色权重调至最高值，否则将该角色权重调整为100
        let chars = this.getAliveChars();
        let maxPrior = 100;
        // 如果其他角色没有大于等于100的，就让其优先度变成100，否则就一直加1加上去
        for(let charOther of chars){
            if (char.NowTime == charOther.NowTime){
                if(charOther.timePrior >= maxPrior){
                    maxPrior = char.timePrior + 1;
                }
            }
        }
        char.timePrior = maxPrior;
        char.timeBarPort.moveToTop();
        this.curChar = null;
        this.roundAdd();
    }

    public charAddTime(char:L2Char, time: number, prior:number = -1): void{
        // 角色时间增加或减少

        // 如果存在时间重叠，则对权重进行处理
        // 如果prior 不等于-1，那么权重就按照给予的权重直接赋值
        // 如果time是负数，代表加速往前冲，权重往大调；如果是正数，表示被推下来了，重叠权重往小调
    }

    public roundNum: number = 1;
    public roundAdd(): void{
        this.roundNum += 1;
        if (this.roundNum % 3 == 0){
            (SceneManager.Ins.curScene as L2MainScene).energyManager.addEnergy(1);
        }
        (SceneManager.Ins.curScene as L2MainScene).mainUI.roundLabel.text = `${this.roundNum}`
    }

    public release(): void{
        this.curChar = null;
    }
}