function Login() {
    return (
        <>
            <div className="w-auto h-auto rounded-4xl bg-amber-950">
                <h1>Login</h1>
                <form>
                    <label htmlFor="uid">UserID:</label>
                    <input type="text" id="uid" nane="uid" />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" nane="password" />

                    
                </form>
            </div>

        </>
    );
}

export default Login;
