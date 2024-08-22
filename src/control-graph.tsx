import { ToolsEnum } from "./App";

type Props = {
  setTools: React.Dispatch<React.SetStateAction<ToolsEnum>>;
};

const ControlGraph = ({ setTools }: Props) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
        gap: '4px',
        cursor: 'pointer',
        zIndex: 10,
      }}>
      <div onClick={()=>setTools(ToolsEnum.None)}>none</div>
      <div onClick={()=>setTools(ToolsEnum.CreateMarker)}>marker</div>
      <div onClick={()=>setTools(ToolsEnum.DrawLine)}>line</div>
      <div onClick={()=>setTools(ToolsEnum.DeleteMarker)}>delete marker</div>
      <div onClick={()=>setTools(ToolsEnum.DeleteLine)}>delete line</div>
    </div>
  );
};

export default ControlGraph;
