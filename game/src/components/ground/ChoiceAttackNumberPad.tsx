import closeBtn from "../../asset/png/close_btn.png";

type ChoiceAttackNumberType = {
   deleteNum : () => void;
   cntText : string;
   setCntText : (newState : string) => void;
   selectNum :(event: React.MouseEvent<HTMLButtonElement>) => void;
   myNumArray: string[];
   numObject : any;
}

const ChoiceAttackNumberPad = ({
  deleteNum,
  cntText,
  setCntText,
  selectNum,
  myNumArray,
  numObject
}: ChoiceAttackNumberType) => {
  return (
    <>
      <div className="game_pad_second_text">
        <input
          type="text"
          onChange={(e) => setCntText(e.target.value)}
          defaultValue={cntText}
          className="game_pad_text_insert"
          id="input_first"
          readOnly
          placeholder="0"
          onKeyPress={(e) => {
            // if (e.key === 'Backspace') {
            //     // registerTeam();
            // }
          }}
        />
        <div className="game_pad_second_text_block">
          <button
            className="game_pad_second_text_block_btn"
            onClick={() => deleteNum()}
          >
            <img
              src={closeBtn}
              alt={"close"}
              className="game_pad_second_text_block_btn_icon"
            />
          </button>
        </div>
      </div>
      {numObject.map((data : any, index:number) => (
         console.log('타입보기 data no', typeof(data)),
        <div className="game_pad_second_num_line" key={"btn_key" + index}>
          {data.no1 !== "" && (
            <button
              className="btn_num"
             onClick={selectNum}
              value={`${data.no1}`}
              disabled={myNumArray.length === 3 ? true : false}
            >
              {data.no1}
            </button>
          )}
          <button
            className="btn_num"
            onClick={selectNum}
            value={`${data.no2}`}
            disabled={myNumArray.length === 3 ? true : false}
          >
            {data.no2}
          </button>
          {data.no3 !== "" && (
            <button
              className="btn_num"
              onClick={selectNum}
              value={`${data.no3}`}
              disabled={myNumArray.length === 3 ? true : false}
            >
              {data.no3}
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default ChoiceAttackNumberPad;