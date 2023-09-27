import { ReactNode } from "react";

interface Props {
    children: ReactNode
}

const Scroll: React.FC<Props> = (props) => {
    return (
        <div style={{ overflowY:'scroll', height: '200px' }}>
            {props.children}
        </div>
    )
}

export default Scroll;