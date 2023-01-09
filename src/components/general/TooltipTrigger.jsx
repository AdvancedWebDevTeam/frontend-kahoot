import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function TooltipTrigger(props) {
  const { text, children } = props;
  const renderTooltip = (props) => (
    <Tooltip id={text} {...props}>
      {text}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 250 }}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
}

export default TooltipTrigger;
