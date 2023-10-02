import {FC} from "react";

interface TimerIconProps {
    className?: string;
}

const TimerIcon: FC<TimerIconProps> = ({ className = "" }) => {
    return (
        <svg className={className} width="30" height="35" viewBox="0 0 30 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7402 0.425049V3.27398H13.5892V4.69811C14.586 4.5559 15.4406 4.5559 16.4381 4.69811V3.27398H19.287V0.425049H10.7409H10.7402Z" fill="black"/>
            <circle cx="15.0133" cy="19.754" r="11.2125" fill="white"/>
            <path d="M24.6989 9.82591L25.6957 8.82909L26.8354 9.96879L28.8298 7.97448L24.5567 3.70142L22.5624 5.69573L23.7021 6.83544L22.4202 8.11736C15.5833 3.98584 6.75206 6.12237 2.76409 12.9593C-1.22454 19.7962 0.911989 28.3423 7.60667 32.4731C14.3014 36.604 23.1319 34.4674 27.1205 27.6305C30.6812 21.7905 29.6844 14.3841 24.6989 9.82591ZM15.0131 30.1944C9.45811 30.1944 5.04284 25.7791 5.04284 20.2241C5.04284 14.6692 9.45811 10.2539 15.0131 10.2539V20.2241H24.9833C24.9833 25.7791 20.5681 30.1944 15.0131 30.1944Z" fill="black"/>
        </svg>
    )
}

export default TimerIcon