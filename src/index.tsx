import * as esbuild from 'esbuild-wasm'
import ReactDOM from 'react-dom';
import {useState, useEffect, useRef} from 'react'

import {unpkgPathPlugin} from './plugins/unpak-path-plugin';


const App = () => {
    const [input , setInput] = useState('');
    const [code , setCode] = useState('');
    const ref = useRef<any>()


    const onClick = async () => {
        console.log(input)
        if(!ref.current) {
            return;
        }
    //    const result =  await ref.current.transform(input, {
    //         loader: 'jsx',
    //         target: 'es2015'
    //     });

    const result = await ref.current.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin()]
    })
        console.log(result)
        setCode(result.outputFiles[0].text);

    };

    
   
    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        });

        // console.log(service);

    };

    useEffect (() => {
        startService()
    }, [])

    return(
        <div>
            <textarea 
            value = {input}
            onChange={e => setInput(e.target.value)}
            ></textarea>
            <div>
                <button
                onClick ={onClick}
                >Submit</button>
            </div>
            <pre>{code}</pre>
        </div>
    );
};

ReactDOM.render(
    <App />,
    document.querySelector('#root')
);

