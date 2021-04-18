export default class View{
    static colors={
        '1':'cyan',
        '2':'blue',
        '3':'orange',
        '4':'yellow',
        '5':'green',
        '6': 'purple',
        '7':'red'
    }
    
    constructor(element,width,height,rows,columns){
        this.element=element;
        this.width=width;
        this.height=height;
        
        this.canvas=document.createElement('canvas');
        this.canvas.width=this.width;
        this.canvas.height=this.height;
        this.context=this.canvas.getContext('2d');

        this.playfieldBorderWidth=4;
        this.playfieldX=4;
        this.playfieldY=4;
        this.playfieldWidth=this.width*2/3;
        this.playfieldHeight=this.height;
        this.playfieldInnerWidth=this.playfieldWidth-this.playfieldBorderWidth*2;
        this.playfieldInnerHeight=this.playfieldHeight-this.playfieldBorderWidth*2;

        this.panelX=this.playfieldWidth+10;
        this.panelY=0;
        this.panelWidth=this.width/3;
        this.panelHeight=this.height;

        this.blockWidth=(this.playfieldInnerWidth/columns);
        this.blockHeight=(this.playfieldInnerHeight/rows);

        this.element.appendChild(this.canvas);
    }

    renderMainScreen(state){//отображение фигуры при нажатии на кнопки в индексе
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    renderStartScreen(){
        
        this.context.fillStyle='white';
        this.context.font='24px "Press Start 2P"';
        this.context.textAlign='center';
        this.context.textBaseline='middle';
        this.context.fillText('Press Enter to start',this.width/2,this.height/2);
        this.context.fillText('Разработано овощем',this.width/2,this.height/2+48);
    }

    renderPauseScreen(){
        this.context.fillStyle='rgba(0,0,0,0.75)';
        this.context.fillRect(0,0,this.width,this.height);

        this.context.fillStyle='white';
        this.context.font='18px "Press Start 2P"';
        this.context.textAlign='center';
        this.context.textBaseline='middle';
        this.context.fillText('Press Enter to resume',this.width/2,this.height/2);
    }

    renderEndScreen({score}){
        this.clearScreen();

        this.context.fillStyle='white';
        this.context.font='18px "Press Start 2P"';
        this.context.textAlign='center';
        this.context.textBaseline='middle';
        this.context.fillText('GAME OVER',this.width/2,this.height/2-48);
        this.context.fillText(`Score:${score}`,this.width/2,this.height/2);
        this.context.fillText("Press Enter to Restart",this.width/2,this.height/2+48);
    }

    clearScreen(){//очищение поля после изменения положения фигуры
        this.context.clearRect(0,0,this.width,this.height);
    }

    renderPlayfield({playfield}){//нарисовка фигуры
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];
            
            for (let x = 0; x < line.length; x++) {
                const block = line[x];
                
                if(block){
                    this.renderBlock(
                        this.playfieldX+(x*this.blockWidth),
                        this.playfieldY+(y*this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        View.colors[block]
                    );
                }
            }
        }

        this.context.strokeStyle='white';
        this.context.lineWidth=this.playfieldBorderWidth;
        this.context.strokeRect(0,0,this.playfieldWidth,this.playfieldHeight)
    }

    renderPanel({level,score,lines,nextPiece}){
            this.context.textAlign='start';
            this.context.textBaseline='top';
            this.context.fillStyle='white';
            this.context.font='14px "Press Start 2P"';

            this.context.fillText(`score:${score}`,this.panelX,this.panelY+0);
            this.context.fillText(`lines:${lines}`,this.panelX,this.panelY+24);
            this.context.fillText(`level:${level}`,this.panelX,this.panelY+48);
            this.context.fillText('Next:',this.panelX,this.panelY+96)

            for (let y = 0; y < nextPiece.block.length; y++) {
                for (let x = 0; x < nextPiece.block[y].length; x++) {
                    const nextBlock=nextPiece.block[y][x];
                    if(nextBlock){
                        this.renderBlock(
                        this.panelX+(x*this.blockWidth*0.5),
                        this.panelY+100+(y*this.blockHeight*0.5),
                        this.blockWidth*0.5,
                        this.blockHeight*0.5,
                        View.colors[nextBlock]
                        );
                    }
                    
                }
                
            }
    }

    renderBlock(x,y,width,height,color){
        this.context.fillStyle=color;
        this.context.strokeStyle='black';
        this.context.lineWidth=2;

        this.context.fillRect(x,y,width,height);
        this.context.strokeRect(x,y,width,height);
    }
}