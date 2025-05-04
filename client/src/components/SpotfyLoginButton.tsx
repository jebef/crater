
export default function SpotifyLoginButton() {
    const handleClick = () => {
        const backend_login_endpoint = import.meta.env.VITE_BACKEND_LOGIN_ENDPOINT;
        window.location.href = new URL(backend_login_endpoint).toString();
    }

    return (
        <button onClick={handleClick}>
            Connect to Spotify
        </button>
    );
}