

const encodeURIParameters = (obj) => {
    let str = ''
    for(var name in obj)
        str += (name + '=' + obj[name] + '&')
    return str.slice(0,-1)
}


module.exports = {encodeURIParameters}
