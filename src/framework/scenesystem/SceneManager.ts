class SceneManager{

	public curScene: IScene;
	private static _instance: SceneManager;

	private constructor(){
	}

	public static get Ins():SceneManager{
		if(SceneManager._instance){
			return SceneManager._instance;
		}
		SceneManager._instance = new SceneManager();
		return SceneManager._instance;
	}

	/**
	 * 设置初始场景
	 */
	public initial(){
		this.setScene(new StartScene());
	}

	/**
	 * switch scene
	 */
	public setScene(scene: IScene){
		LayerManager.Ins.showLoadingUILayer();
		let oldScene = this.curScene;
		this.curScene = null; // 先将当前场景置空，加载完成后再赋值为scene
		if (oldScene != null){
			oldScene.defaultRelease();
			oldScene.release();
			oldScene.releaseResource();
			oldScene = null;
		}
		this.loadScene(scene);
	}

	/**
	 * call when scene load;
	 * loading resource (async) of the scene;
	 * and then initializing the scene, 
	 * 场景初始化之后再将SceneManager.curscene设置为该场景
	 * finally removing loadingUILayer (onSceneLoadingCompelete)
	 */
	private loadScene(scene: IScene): void{
		scene.loadResource().then(
			()=>{
				scene.initial();
				this.onSceneLoadingCompelete();
				this.curScene = scene;
			}
		);
	}

	/**
	 * call after scene loading compelete
	 */
	private onSceneLoadingCompelete(): void{
		LayerManager.Ins.hideLoadingUILayer();
	}

	/**
	 * call by every frame
	 */
	public update(){
		if(this.curScene != null){
			this.curScene.update();
		}
	}

}
