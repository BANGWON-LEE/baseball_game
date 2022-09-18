import React from "react";
import '../styles/component.scss'

const Main: React.FC = () => {

  return(
    <div className="main_back">
      <div className="main_block">
        <div className="project_title">
          <h1>Baseball Game</h1>
        </div>
        <div className="project_content">
          <div>
            <input type="text" placeholder="팀명을 입력하세요." className="project_content_title" />
            <button className="project_content_btn">
              등록
            </button>
          </div>
        </div>
        <div className="project_bottom">
          <button className="btn_game_start">
            게임시작
          </button>
        </div>
      </div>
    </div>
  )
  
}

export default Main;