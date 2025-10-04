import { useState } from "react";
import styles from "./Login.module.css";
import { Alert, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export interface LoginProps {
    title?: string,
    onLogin: (username: string, password: string) => void,
    failed?: boolean,
}

export default function Login(props: LoginProps){
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{props.title || "Login"}</h2>
            <TextField 
                value={username}
                label={'Username'}
                onChange={(e)=>setUsername(e.target.value)}
            />
            <FormControl>
                <InputLabel className={styles.input_label}>Password</InputLabel>
                <OutlinedInput
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                { showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/> }
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            { props.failed && 
                <Alert severity="error">
                    Login failed 🥸
                </Alert>
            }
            <Button onClick={() => props.onLogin(username, password)}>Login</Button>
        </div>
    );
}