import 'egg';

declare module 'egg' {
    interface mysql {
        get(tableName:string,find?:{}):Promise<any>

        query(sql:string,values?:Any[]):Promise<any>
    }
    interface redis {
        set(keyName:string,value:string):Promise<any>

        get(keyName:string):Promise<any>
    }
    interface Application {
        mysql:mysql;
        redis:redis;
    }
}
