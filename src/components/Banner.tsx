
import Button from './Button';

const Banner = () => {

    return (
        <div className="feedback">
            <p className="feedback_message_hidden"></p>
            <div className="feedback_buttons-box">
                <Button text="One Browser" />
                <Button text="Two Browser" />
            </div>
        </div>
    )
}

export default Banner;