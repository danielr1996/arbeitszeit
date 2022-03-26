// https://www.fullstacklabs.co/blog/creating-an-svg-gauge-component-from-scratch
import {ReactElement} from "react"

type GaugeProps = {
    percentage?: number,
    centerText?: ReactElement,
    startText?: ReactElement,
    endText?: ReactElement,
}
export const Gauge = ({percentage, centerText, startText, endText}: GaugeProps) => {
    // Percentage to decimal
    if(!percentage || percentage>1){
        percentage = 1
    }
    // How "long" the whole gauge is
    const width = 270

    // Rotate that "gap" is center bottom
    const rotateOffset = 90 + (360 - width) / 2

    //Radius
    const radius = 170

    // Width
    const strokeWidth = 50

    return <>
        <div className="absolute flex items-center justify-center"
             style={{width: radius * 2, height: radius * 2}}>{centerText}</div>
        <svg height={radius * 2} width={radius * 2}>
            {/*<text x="50%" y="50%" textAnchor="middle" className="fill-amber-400 text-3xl">{centerText.map(text =>*/}
            {/*    <tspan>{text}</tspan>)}</text>*/}
            <Arc from={0} to={width * percentage} rotateOffset={rotateOffset} radius={radius}
                 strokeWidth={strokeWidth} strokeColor="stroke-lime-800"/>
            <Arc from={width * percentage} to={width} rotateOffset={rotateOffset} radius={radius}
                 strokeWidth={strokeWidth} strokeColor="stroke-red-800"/>
        </svg>
        <div className="flex justify-between px-5 translate-y-[-40px]" style={{width: radius*2}}>
            <div>{startText}</div>
            <div>{endText}</div>
        </div>
    </>
}

type ArcProps = {
    from: number,
    to: number,
    radius: number,
    strokeWidth: number,
    rotateOffset: number,
    strokeColor: string,
}
const Arc = ({from, to, rotateOffset, radius, strokeWidth, strokeColor}: ArcProps) => {
    const circumference = radius * 2 * Math.PI

    const arc = circumference * ((to - from) / 360)

    const strokeDashArray = `${arc} ${circumference}`
    const transform = `rotate(${rotateOffset + from}, ${radius}, ${radius})`
    return <>
        <defs>
            <clipPath id="insideCircleOnly">
                <circle cx={radius} cy={radius} r={radius}/>
            </clipPath>
        </defs>
        <circle cx={radius} cy={radius} r={radius} className={`${strokeColor} fill-transparent`}
                strokeWidth={strokeWidth}
                clipPath="url(#insideCircleOnly)" strokeDasharray={strokeDashArray} transform={transform}/>
    </>
}