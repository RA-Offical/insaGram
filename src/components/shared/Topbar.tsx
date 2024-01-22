import { Link } from "react-router-dom";

function Topbar() {
	return (
		<section className="topbar">
			<div className="flex-between py-4 px-5">
				<Link to="/">
					<img src="/assets/images/logo.svg" alt="logo" width={130} height={325} />
				</Link>
			</div>
		</section>
	);
}
export default Topbar;
