type GenericObject = {
    [key: string]: any
}

type MessageCommand = {
    name: string,
    params: string,
    flags: {
        [key: string]: string
    }
}