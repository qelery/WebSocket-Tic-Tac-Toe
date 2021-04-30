
interface ButtonProps {
    text: string;
}

const Button = ( { text }: ButtonProps ) => {

    return (<button className="feedback_button">{ text }</button>)
}

export default Button;