export default class Game{

    static points={
        '1':40,
        '2':100,
        '3':300,
        '4':1200
    }


    constructor(){
        this.reset();
    }

    get level(){
            return Math.floor(this.lines*0.1)

        }
   

    getState(){//перенос значений в игровое поле
        const playfield=this.createPlayfield();
        const{y:pieceY,x:pieceX,block}=this.activePiece;
        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y]=[];
 
            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x]=this.playfield[y][x];
                
            }
             
         }

         for (let y = 0; y < block.length; y++) {
             for (let x = 0; x <block[y].length ; x++) {
                if(block[y][x]){
                    playfield[pieceY+y][pieceX+x]=block[y][x];
                }
                 
             }
             
         }


        return{
            score:this.score,
            level:this.level,
            lines:this.lines,
            nextPiece:this.nextPiece,
            playfield,
            isGameOver:this.topOut
        }
    }

    reset(){
        this.score=0;
        this.lines=0;
        this.topOut=false;
        this.playfield=this.createPlayfield();//создание поля
        this. activePiece=this.createPeace();
        this.nextPiece=this.createPeace();
    }

    createPlayfield(){ //создание игрового поля 
        const playfield=[];

        for (let y = 0; y < 20; y++) {
           playfield[y]=[];

           for (let x = 0; x < 10; x++) {
               playfield[y][x]=0;
               
           }
            
        }
        return playfield;
    }


    createPeace(){
            const index=Math.floor(Math.random()*7);
            const type='IJLOSTZ'[index];
            const piece={};
            switch(type){
                case 'I':
                    piece.block=[
                        [0,0,0,0],
                        [1,1,1,1],
                        [0,0,0,0],
                        [0,0,0,0]
                    ]
                    break;
                case 'J':
                    piece.block=[
                        [0,0,0],
                        [2,2,2],
                        [0,0,2]
                    ]
                    break;
                case 'L':
                    piece.block=[
                        [0,0,0],
                        [3,3,3],
                        [3,0,0]
                    ]
                    break;
                case 'O':
                    piece.block=[
                        [0,0,0,0],
                        [0,4,4,0],
                        [0,4,4,0],
                        [0,0,0,0]
                    ]
                    break;
                case 'S':
                    piece.block=[
                        [0,0,0],
                        [0,5,5],
                        [5,5,0]
                    ]
                    break;
                    
                case 'T':
                    piece.block=[
                        [0,0,0],
                        [6,6,6],
                        [0,6,0]
                    ]
                    break;
                case 'Z':
                    piece.block=[
                        [0,0,0],
                        [7,7,0],
                        [0,7,7]
                        
                    ]
                    break;
                default:
                    throw new Error('неизвестный тип фигуры');
                }

                piece.x=Math.floor((10-piece.block[0].length)/2);
                piece.y=-1;
            return piece;
    }

    movePieceLeft(){
        this.activePiece.x-=1;
        if(this.hasCollision()){
            this.activePiece.x+=1;
        }
    };
    movePieceRight(){
        this.activePiece.x+=1;
        if(this.hasCollision()){
            this.activePiece.x-=1;
        }
    };
    movePieceDown(){
        if(this.topOut) return
         
        this.activePiece.y+=1;
        if(this.hasCollision()){
            this.activePiece.y-=1;
            this.lockPiece();
            let clearedLines=this.clearLines();
            this.updateScore(clearedLines);
            this.updatePieces();
        }

        if(this.hasCollision()){
            this.topOut=true; 
        }
    };


    rotatePeace(){
        this.rotateBlock();
         if(this.hasCollision()){
            this.rotateBlock(false);
         }

    }

    rotateBlock(clock=true){// при нажатии кнопки вверх фигура поворачивается в сторону по часовой стрелке
        const block=this.activePiece.block;
        const lenght=block.length;
        const x=Math.floor(lenght/2);
        const y=lenght-1;
        for (let i = 0; i < x; i++) {
               for (let j = i; j < y-i; j++) {
                   const temp=block[i][j];
                   if(clock){
                        block[i][j]=block[y-j][i];
                        block[y-j][i]=block[y-i][y-j];
                        block[y-i][y-j]=block[j][y-i];
                        block[j][y-i]=temp;
                   }else{
                       block[i][j]=block[j][y-i];
                       block[j][y-i]=block[y-i][y-j];
                       block[y-i][y-j]=block[y-j][i];
                       block[y-j][i]=temp;


                   }
                   
               }
    
        }





    }
    hasCollision(){//проверка на столкновение со стеной или другими фигурами
        let {x:pieceX,y:pieceY,block}=this.activePiece;
        for (let y = 0; y < block.length; y++) {
            
           for (let x = 0; x < block[y].length; x++) {
              if(
                  block[y][x] &&
                  ((this.playfield[pieceY+y] === undefined || this.playfield[pieceY+y][pieceX+x] === undefined)||(this.playfield[pieceY+y][pieceX+x]))){
                  return true;
              }
           }
            
        }
       return false;
    };
    lockPiece(){//перенос значений в игровое поле ,но не отображение их визуально
        
        let {x:pieceX,y:pieceY,block}=this.activePiece;
        for (let y = 0; y < block.length; y++) {
            
           for (let x = 0; x < block[y].length; x++) {
               if(block[y][x]){
                this.playfield[pieceY+y][pieceX+x]= block[y][x];
               }
               
           }
            
        }
    }


     clearLines(){ //удаление линиий при заполнении ячейки
        const rows=20;
        const columns=10;
        let lines=[];

        for (let y = rows-1; y >=0; y--) {
           let numberOfBlocks=0;

           for (let x = 0; x < columns; x++) {
               if(this.playfield[y][x]){
                   numberOfBlocks+=1;
               }
               
           }

           if(numberOfBlocks===0){
                break;
           } else if(numberOfBlocks<columns){
               continue;
           }else if(numberOfBlocks===columns){
               lines.unshift(y);
           }
           
        }

        for(let index of lines){
            this.playfield.slice(index,1);
            this.playfield.unshift(new Array(columns).fill(0));
        }
        return lines.length;
        
    } 


    updateScore(clearedLines){//изменение счета и уровня
        console.log(this.level);
        if(clearedLines>0){
            
            this.score=Game.points[clearedLines]*(this.level+1);
            this.lines+=clearedLines;
            console.log(this.score,this.lines,this.level);
        }
    }

    updatePieces(){
        this.activePiece=this.nextPiece;
        this.nextPiece=this.createPeace();
    }
}

