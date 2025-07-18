import MediaQuery from "react-responsive"
import DesktopNavBar from "./desktop_nav"
import MobileNavBar from "./mobile_nav"

const ResponsiveNav = () => {
    return (
        <>
            <MediaQuery minWidth={1023}>
                <DesktopNavBar />
            </MediaQuery>
            <MediaQuery maxWidth={1023}>
                <MobileNavBar />
            </MediaQuery>
        </>
    )
}

export default ResponsiveNav