import { Link } from 'react-router-dom';
import GradientBackground from '../components/GradientBackground';
import DomainNoticePopup from '../components/DomainNoticePopup';

const NotFoundPage = () => {
    return (
        <div className="flex w-screen h-screen items-center justify-center">
            <GradientBackground />
            <DomainNoticePopup />
            <div className="relative z-10 text-center px-6">
                <p className="text-6xl font-extrabold text-indigo-600">404</p>
                <h1 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h1>
                <p className="mt-2 text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
                <Link
                    to="/"
                    className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
