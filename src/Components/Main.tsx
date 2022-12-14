import React, { useState } from "react";
import { Link, useRoutes } from "react-router-dom";
import '../styles/component.scss'

const Main: React.FC = () => {


  const [teamName, setTeamName] = useState<string>('');
  const [resultName, setResultName] = useState<Boolean>(false);
  
  const registerTeam = () : void => {
    setResultName(true);
  }
  const changeTeamName = () : void => {
    setResultName(false);
    setTeamName('')
  }

  return(
    <div className="main_back">
      <div className="main_block">
        <div className="project_title">
          <h1>Baseball Game</h1>
          {resultName === true &&
          <>
            <h5>{teamName}</h5>
            <div className="project_title_change">
              <button onClick={changeTeamName} className="project_title_change_team_name">
                팀명 변경하기
              </button>
            </div>
          </>
          }
        </div>
        <div className="project_content">
          <div>
            {resultName === false &&
              <>
                <input 
                  type="text" 
                  placeholder="팀명을 입력하세요." 
                  className="project_content_title"   
                  onChange={(e) => setTeamName(e.target.value)} 
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      registerTeam();
                    }
                  }}
                />
                <button onClick={registerTeam} className="project_content_btn">
                  등록
                </button>
              </> 
            }
          </div>
        </div>
        <div className="project_bottom">
        {resultName === true &&
          <Link to={`/game?team=${teamName}`}>
            <button className="btn_game_start">
              게임시작
            </button>
          </Link>
        }
        </div>
      </div>
    </div>
  )
  
}

export default Main;