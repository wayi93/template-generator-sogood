const express = require('express');
const router = express.Router();
var Template = require('../models/Template');

const config = require('../config');

router.post('/template/add', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', config.api_whitelist);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var template = new Template();

    var cfm = '';
    var msg = '';

    var reqBody = null;
    for (var key in req.body)
    {
        reqBody = JSON.parse(key);
    }

    if(reqBody != null){

        template.create_by = reqBody.create_by;
        template.update_by = reqBody.update_by;
        template.channel_id = reqBody.channel_id;
        template.version = reqBody.version;
        template.templateDatas_db = JSON.stringify(reqBody.templateDatas_db);

        template.product_name = '';
        template.ebay_artikelnummer = '';
        var infoForm = reqBody.templateDatas_db.infoForm;
        if(infoForm != null){
            template.product_name = infoForm.productName;
            template.ebay_artikelnummer = infoForm.eBayArtikelNr;
        }

        template.save(function(results){

            if(results.is_success){
                cfm = 'success';
            }else{
                cfm = 'failed';
            }

            return res.send({
                confirmation: cfm,
                message : results.message,
                id : results.template_db_id
            });

        });

    }else{

        cfm = 'failed';
        msg = "Can't get POST parameters!";

        return res.send({
            confirmation: cfm,
            message : msg,
            id : 0
        });

    }

});

router.post('/templates', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', config.api_whitelist);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var template = new Template();

    var cfm = '';
    var msg = '';

    template.getAll(function(results){

        if(results.is_success){
            cfm = 'success';
        }else{
            cfm = 'failed';
        }

        msg = results.message;

        return res.send({
            confirmation: cfm,
            message : msg,
            templates : results.templates
        });

    });

});

router.post('/template', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', config.api_whitelist);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var template = new Template();

    var cfm = '';
    var msg = '';

    var reqBody = null;
    for (var key in req.body)
    {
        reqBody = JSON.parse(key);
    }

    if(reqBody != null){

        template.template_db_id = reqBody.template_db_id;

        template.get(function(results){

            if(results.is_success){
                cfm = 'success';
            }else{
                cfm = 'failed';
            }

            return res.send({
                confirmation: cfm,
                message : results.message,
                template : results.template
            });

        });

    }else{

        cfm = 'failed';
        msg = "Can't get POST parameters!";

        return res.send({
            confirmation: cfm,
            message : msg,
            template_db_id : 0,
            template : null
        });

    }

});

router.post('/template/update', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', config.api_whitelist);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var template = new Template();

    var cfm = '';
    var msg = '';

    var reqBody = null;
    for (var key in req.body)
    {
        reqBody = JSON.parse(key);
    }

    if(reqBody != null){

        template.template_db_id = reqBody.template_db_id;

        template.templateDatas_db = JSON.stringify(reqBody.templateDatas_db);

        template.product_name = '';
        template.ebay_artikelnummer = '';
        var infoForm = reqBody.templateDatas_db.infoForm;
        if(infoForm != null){
            template.channel_id = infoForm.channelId;
            template.product_name = infoForm.productName;
            template.ebay_artikelnummer = infoForm.eBayArtikelNr;
        }

        template.update(function(results){

            if(results.is_success){
                cfm = 'success';
            }else{
                cfm = 'failed';
            }

            return res.send({
                confirmation: cfm,
                message : results.message,
                id : results.template_db_id
            });

        });

    }else{

        cfm = 'failed';
        msg = "Can't get POST parameters!";

        return res.send({
            confirmation: cfm,
            message : msg,
            id : 0
        });

    }

});

router.post('/template/clone', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', config.api_whitelist);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var template = new Template();

    var cfm = '';
    var msg = '';

    var reqBody = null;
    for (var key in req.body)
    {
        reqBody = JSON.parse(key);
    }

    if(reqBody != null){

        template.template_db_id = reqBody.template_db_id;
        template.create_by = reqBody.create_by;
        template.update_by = reqBody.update_by;

        template.clone(function(results){

            if(results.is_success){
                cfm = 'success';
            }else{
                cfm = 'failed';
            }

            return res.send({
                confirmation: cfm,
                message : results.message,
                id : results.template_db_id
            });

        });

    }else{

        cfm = 'failed';
        msg = "Can't get POST parameters!";

        return res.send({
            confirmation: cfm,
            message : msg,
            id : 0
        });

    }

});

router.post('/template/delete', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', config.api_whitelist);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var template = new Template();

    var cfm = '';
    var msg = '';

    var reqBody = null;
    for (var key in req.body)
    {
        reqBody = JSON.parse(key);
    }

    if(reqBody != null){

        template.template_db_id = reqBody.template_db_id;

        template.delete(function(results){

            if(results.is_success){
                cfm = 'success';
            }else{
                cfm = 'failed';
            }

            return res.send({
                confirmation: cfm,
                message : results.message,
                id : results.template_db_id
            });

        });

    }else{

        cfm = 'failed';
        msg = "Can't get POST parameters!";

        return res.send({
            confirmation: cfm,
            message : msg,
            id : 0
        });

    }

});

module.exports = router