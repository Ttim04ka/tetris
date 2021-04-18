export default class Controller{
    
    constructor(game,view){
        this.game=game;
        this.view=view;
        this.isPlaying=false;
        this.intervalId=null;
        
     

        document.addEventListener('keydown',this.handleKeyDown.bind(this));
        this.view.renderStartScreen();
    }
    
    update(){
        this.game.movePieceDown();
        this.updateView();
    }
     
    pause(){
        this.isPlaying=false;
        this.stopTimer();
        this.updateView();

    }

    play(){
        this.isPlaying=true;
        this.startTimer();
        this.updateView();
    }

    startTimer(){
        const speed=1000-this.game.getState().level*100;
        if(!this.intervalId){
            this.intervalId= setInterval(()=>{
                this.update();
               },speed>0? speed:100)
        }
    }

    stopTimer(){
        if(this.intervalId){
            clearInterval(this.intervalId);
            this.intervalId=null;
        }
    }

    updateView(){
        const score=this.game.getState();
        if(score.isGameOver){
            this.view.renderEndScreen(score)
        }else if(!this.isPlaying){
            this.view.renderPauseScreen()
        }else{
            this.view.renderMainScreen(score)
        }
    }
    reset(){
        this.game.reset();
        this.play();
    }

    handleKeyDown(event){
        const state=this.game.getState();
            switch(event.keyCode){
                case 13://enter
                if(state.isGameOver){
                    this.reset();
                }
                else if(this.isPlaying){
                    this.pause();
                } else{
                    this.play()
                }
                break;

                case 37: //left
                this.game.movePieceLeft();
                this.updateView();
                break;
        
                case 38: //up
                this.game.rotatePeace();
                this.updateView();
               
                break;
        
                case 39: //right
                this.game.movePieceRight();
                this.updateView();
                break;
                
                case 40: //down
                this.game.movePieceDown();
                this.updateView();
                break;
            }
       
    }
}