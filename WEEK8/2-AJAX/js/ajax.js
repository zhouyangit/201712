~function () {
    class ajaxClass {
        //=>SEND AJAX
        init() {
            //=>THIS:EXAMPLE
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = ()=> {
                if (!/^[23]\d{2}$/.test(xhr.status)) return;
                if (xhr.readyState === 4) {
                    let result = xhr.responseText;
                    //=>DATA-TYPE
                    try {
                        switch (this.dataType.toUpperCase()) {
                            case 'TEXT':
                            case 'HTML':
                                break;
                            case 'JSON':
                                result = JSON.parse(result);
                                break;
                            case 'XML':
                                result = xhr.responseXML;
                        }
                    } catch (e) {
                        
                    }
                    this.success(result);
                }
            };

            //=>DATA
            if (this.data !== null) {
                this.formatData();

                if (this.isGET) {
                    this.url += this.querySymbol() + this.data;
                    this.data = null;
                }
            }

            //=>CACHE
            this.isGET ? this.cacheFn() : null;

            xhr.open(this.method, this.url, this.async);
            xhr.send(this.data);
        }

        //=>CONVERT THE PASSED OBJECT DATA TO STRING DATA
        formatData() {
            //=>THIS:EXAMPLE
            if (Object.prototype.toString.call(this.data) === '[object Object]') {
                let obj = this.data,
                    str = ``;
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        str += `${key}=${obj[key]}&`;
                    }
                }
                str = str.replace(/&$/g, '');
                this.data = str;
            }
        }

        cacheFn() {
            //=>THIS:EXAMPLE
            !this.cache ? this.url += `${this.querySymbol()}_=${Math.random()}` : null;
        }

        querySymbol() {
            //=>THIS:EXAMPLE
            return this.url.indexOf('?') > -1 ? '&' : '?';
        }
    }

    //=>INIT PARAMETERS
    window.ajax = function ({
        url = null,
        method = 'GET',
        type = null,
        data = null,
        dataType = 'JSON',
        cache = true,
        async = true,
        success = null
    }={}) {
        let _this = new ajaxClass();
        ['url', 'method', 'data', 'dataType', 'cache', 'async', 'success'].forEach((item)=> {
            if (item === 'method') {
                _this.method = type === null ? method : type;
                return;
            }
            if (item === 'success') {
                _this.success = typeof success === 'function' ? success : new Function();
                return;
            }
            _this[item] = eval(item);
        });
        _this.isGET = /^(GET|DELETE|HEAD)$/i.test(_this.method);
        _this.init();
        return _this;
    };
}();