var dateTime = require('node-datetime');
const mysql = require('mysql');
const config = require('../config');

class Template {

    constructor() {

        /** columns */
        this._create_at = 0;
        this._update_at = 0;
        this._create_by = 0;
        this._update_by = 0;
        this._channel_id = '';
        this._version = '';
        this._templateDatas_db = '';
        this._product_name = '';
        this._ebay_artikelnummer = '';
        this._template_db_id = 0;
        this._is_active = true;

        /** conn */
        this._conn = mysql.createConnection({
            host : config.database.host,
            user : config.database.user,
            password : config.database.password,
            database : config.database.database
        });

        /** bind functions */
        this.save = this.save.bind(this);
        this.getAll = this.getAll.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.clone = this.clone.bind(this);
        this.delete = this.delete.bind(this);

    }

    set create_at(param) {
        this._create_at = param;
    }

    get create_at() {
        return this._create_at;
    }

    set update_at(param) {
        this._update_at = param;
    }

    get update_at() {
        return this._update_at;
    }

    set create_by(param) {
        this._create_by = param;
    }

    get create_by() {
        return this._create_by;
    }

    set update_by(param) {
        this._update_by = param;
    }

    get update_by() {
        return this._update_by;
    }

    set channel_id(param) {
        this._channel_id = param;
    }

    get channel_id() {
        return this._channel_id;
    }

    set version(param) {
        this._version = param;
    }

    get version() {
        return this._version;
    }

    set templateDatas_db(param) {
        this._templateDatas_db = param;
    }

    get templateDatas_db() {
        return this._templateDatas_db;
    }

    set product_name(param) {
        this._product_name = param;
    }

    get product_name() {
        return this._product_name;
    }

    set ebay_artikelnummer(param) {
        this._ebay_artikelnummer = param;
    }

    get ebay_artikelnummer() {
        return this._ebay_artikelnummer;
    }

    set template_db_id(param) {
        this._template_db_id = param;
    }

    get template_db_id() {
        return this._template_db_id;
    }

    set is_active(param) {
        this._is_active = param;
    }

    get is_active() {
        return this._is_active;
    }

    save(callback) {

        var self = this;
        var conn = this._conn;
        var results = {};

        /** Time */
        var dt = dateTime.create();
        var dt_formatted = dt.format('Y-m-d H:M:S');
        self._create_at = Date.parse(dt_formatted);
        self._update_at = self._create_at;

        conn.connect(function(error){

            if(error){
                results.is_success = false;
                results.message = "Can't connect to database. Error-Code: " + error.message;
                results.template_db_id = 0;
                return callback(results);
            }else{
                var sql = "INSERT INTO `tg_templates` (`create_at`, `update_at`, `create_by`, `update_by`, `content`, `channel_id`, `version`, `product_name`, `ebay_artikelnummer`, `is_active`) VALUES ?";
                var values = [
                    [self._create_at, self._update_at, self._create_by, self._update_by, self._templateDatas_db, self._channel_id, self._version, self._product_name, self._ebay_artikelnummer, self._is_active]
                ];
                conn.query(sql, [values], function(err, res) {
                    if(err){
                        results.is_success = false;
                        results.message = "Can't insert data into database. Error-Code: " + err.message;
                        results.template_db_id = 0;
                    }else{
                        results.is_success = true;
                        results.message = "The template was saved into database successful.";
                        results.template_db_id = res.insertId;
                    };
                    return callback(results);
                    conn.end();
                });
            }

        });
      
    }

    getAll(callback){

        var conn = this._conn;
        var results = {};

        conn.connect(function(error){

            if(error){
                results.is_success = false;
                results.message = "Can't load templates from database. Error-Code: " + error.message;
                results.templates = {};
                return callback(results);
            }else{
                var sql = "SELECT `meta_id`, `create_at`, `update_at`, `channel_id`, `version`, `product_name`, `ebay_artikelnummer` FROM `tg_templates` WHERE `is_active` = true ORDER BY `update_at` DESC";
                conn.query(sql, function(err, res) {
                    if(err){
                        results.is_success = false;
                        results.message = "Can't load templates from database. Error-Code: " + err.message;
                        results.templates = {};
                    }else{
                        results.is_success = true;
                        results.message = "The templates were loaded successful.";

                        // format
                        for(var i = 0; i < res.length; ++i){
                            // channel
                            var channel_id = res[i].channel_id;
                            switch(channel_id){
                                case 1:
                                    res[i].channel = 'eBay Mai&Mai';
                                    break;
                                case 2:
                                    res[i].channel = 'eBay Sogood';
                                    break;
                                default:
                                    res[i].channel = 'N/A';
                            }
                            // datetime
                            var create_at = res[i].create_at;
                            var dt = new Date((create_at) + (config.gmt_offset.de * 3600 * 1000));
                            var dt_date = dt.toISOString().slice(0,10);
                            var dt_time = dt.toISOString().slice(11,16);
                            res[i].create_at_dt = dt_date + ' ' + dt_time;
                        }
                        
                        results.templates = res;
                    };
                    return callback(results);
                    conn.end();
                });
            }

        });

    }

    get(callback){
        
        var self = this;
        var conn = this._conn;
        var results = {};

        conn.connect(function(error){

            if(error){
                results.is_success = false;
                results.message = "Can't load template from database. Error-Code: " + error.message;
                results.templates = {};
                return callback(results);
            }else{

                var sql = "SELECT tgt.`meta_id`, tgt.`create_at`, tgt.`update_at`, tgt.`content`, tgc.`name` AS channel, tgt.`version`, tgt.`product_name`, tgt.`ebay_artikelnummer`, tgt.`is_active` FROM `tg_templates` AS tgt LEFT JOIN `tg_channels` AS tgc ON tgt.`channel_id` = tgc.`meta_id` WHERE tgt.`meta_id` = ?";
                conn.query(sql, [self._template_db_id], function(err, res) {
                    if(err){
                        results.is_success = false;
                        results.message = "Can't query template from database. Error-Code: " + err.message;
                        results.template = null;
                    }else{

                        if(res.length === 1){
                            results.is_success = true;
                            results.message = "The template were loaded successful.";

                            let aTpl = res[0];

                            // datetime create_at
                            var create_at = aTpl.create_at;
                            var dt_ca = new Date((create_at) + (config.gmt_offset.de * 3600 * 1000));
                            var dt_ca_date = dt_ca.toISOString().slice(0,10);
                            var dt_ca_time = dt_ca.toISOString().slice(11,16);

                            // datetime update_at
                            var update_at = aTpl.update_at;
                            var dt_ua = new Date((update_at) + (config.gmt_offset.de * 3600 * 1000));
                            var dt_ua_date = dt_ua.toISOString().slice(0,10);
                            var dt_ua_time = dt_ua.toISOString().slice(11,16);

                            results.template = {
                                template_db_id : aTpl.meta_id,
                                create_at_dt : dt_ca_date + ' ' + dt_ca_time,
                                update_at_dt : dt_ua_date + ' ' + dt_ua_time,
                                content : aTpl.content,
                                channel : aTpl.channel,
                                version : aTpl.version,
                                product_name : aTpl.product_name,
                                ebay_artikelnummer : aTpl.ebay_artikelnummer,
                                is_active : aTpl.is_active
                            };

                        }else{
                            results.is_success = false;
                            results.message = "Matching Template Not Found.";
                            results.template = null;
                        }

                    };
                    return callback(results);
                    conn.end();
                });

            }

        });

    }

    update(callback) {

        var self = this;
        var conn = this._conn;
        var results = {};

        /** Time */
        var dt = dateTime.create();
        var dt_formatted = dt.format('Y-m-d H:M:S');
        self._update_at = Date.parse(dt_formatted);

        conn.connect(function(error){

            if(error){
                results.is_success = false;
                results.message = "Can't connect to database. Error-Code: " + error.message;
                results.template_db_id = 0;
                return callback(results);
            }else{
                var sql = "UPDATE `tg_templates` SET `update_at` = ?, `content` = ?, `product_name` = ?, `ebay_artikelnummer` = ?, `channel_id` = ? WHERE `meta_id` = ?";
                var newDate = [self._update_at, self._templateDatas_db, self._product_name, self._ebay_artikelnummer, parseInt(self._channel_id), self._template_db_id];
                conn.query(sql, newDate, function(err, res) {
                    if(err){
                        results.is_success = false;
                        results.message = "Can't update the data into database. Error-Code: " + err.message;
                        results.template_db_id = self._template_db_id;
                    }else{
                        results.is_success = true;
                        results.message = "The template was updated into database successful.";
                        results.template_db_id = self._template_db_id;
                    };
                    return callback(results);
                    conn.end();
                });
            }

        });
      
    }

    clone(callback) {

        var self = this;
        var conn = this._conn;
        var results = {};

        /** Time */
        var dt = dateTime.create();
        var dt_formatted = dt.format('Y-m-d H:M:S');
        self._create_at = Date.parse(dt_formatted);
        self._update_at = self._create_at;

        conn.connect(function(error){

            if(error){
                results.is_success = false;
                results.message = "Can't connect to database. Error-Code: " + error.message;
                results.template_db_id = 0;
                return callback(results);
            }else{
                var sql = "INSERT INTO `tg_templates` (`create_at`, `update_at`, `create_by`, `update_by`, `content`, `channel_id`, `version`, `product_name`, `ebay_artikelnummer`, `is_active`) SELECT `create_at`, `update_at`, `create_by`, `update_by`, `content`, `channel_id`, `version`, `product_name`, `ebay_artikelnummer`, `is_active` FROM `tg_templates` WHERE meta_id = ?";
                conn.query(sql, self._template_db_id, function(err, res) {
                    if(err){
                        results.is_success = false;
                        results.message = "Can't clone and insert data into database. Error-Code: " + err.message;
                        results.template_db_id = 0;
                    }else{
                        results.template_db_id = res.insertId;

                        var sql_update = "UPDATE `tg_templates` SET `create_at` = ?, `update_at` = ? WHERE `meta_id` = ?";
                        var newDate = [self._create_at, self._update_at, results.template_db_id];
                        conn.query(sql_update, newDate, function(err, res) {
                            if(err){
                                //
                            }
                        });

                        results.is_success = true;
                        results.message = "The template was cloned and saved into database successful.";
                    };
                    return callback(results);
                    conn.end();
                });
            }

        });
      
    }

    delete(callback) {

        var self = this;
        var conn = this._conn;
        var results = {};

        /** Time */
        var dt = dateTime.create();
        var dt_formatted = dt.format('Y-m-d H:M:S');
        self._update_at = Date.parse(dt_formatted);

        conn.connect(function(error){

            if(error){
                results.is_success = false;
                results.message = "Can't connect to database. Error-Code: " + error.message;
                results.template_db_id = 0;
                return callback(results);
            }else{
                var sql = "UPDATE `tg_templates` SET `update_at` = ?, `is_active` = ? WHERE `meta_id` = ?";
                var newDate = [self._update_at, false, self._template_db_id];
                conn.query(sql, newDate, function(err, res) {
                    if(err){
                        results.is_success = false;
                        results.message = "Can't delete the data. Error-Code: " + err.message;
                        results.template_db_id = self._template_db_id;
                    }else{
                        results.is_success = true;
                        results.message = "The template was deleted successful.";
                        results.template_db_id = self._template_db_id;
                    };
                    return callback(results);
                    conn.end();
                });
            }

        });
      
    }

}

module.exports = Template
