/**
 * Here are all the methods for /client
 */

const Profile = require('../models/profile');
const Client = require('../models/client');
const Settings = require('../models/settings');
const invalid = require('../utils/formValidation');
const error = require('../middlewares/error');
const i18n = require('i18n');
/**
 * @api {get} /client/all getClientAll
 * @apiDescription Here you can view all the clients from the current user
 * @apiName getClientAll
 * @apiGroup Client
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      'clients': clients,
        "settings": settings,
        "profile":profile,
        "currentUrl":"clientAll"
 *  }
 */
exports.getClientAll = (req, res) => {
    Profile.findOne({fromUser:req.session._id},function(err,profile){
        if(err) console.trace();
        Client.find({fromUser:req.session._id}, function(err, clients) {
            if(err) console.trace();
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if(err) console.trace();
                if (!err ) {
                    console.log(clients);
                    res.render('clients', {
                        'clients': clients,
                        "settings": settings,
                        "profile":profile,
                        "currentUrl":"clientAll"
                    });
                }
            });
        });
    });
};

/**
 * @api {get} /client/new getClientNew
 * @apiDescription Shows a form that creates a new client
 * @apiName getClientNew
 * @apiGroup Client
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "settings": settings,
        "profile":profile,
        "currentUrl":"clientNew"
 *  }
 */
exports.getClientNew = (req, res) => {
    Settings.findOne({fromUser:req.session._id},function(err, settings) {
        if(err) console.trace();
        Profile.findOne({fromUser:req.session._id},function(err,profile) {
            if(err) console.trace();
            if (!err) {
                res.render('new/new-client', {
                    "settings": settings,
                    "profile":profile,
                    "currentUrl":"clientNew"
                });
            }
        });
    });
};

/**
 * @api {post} /client/new postClientNew
 * @apiDescription creates a new client for the specific user, renders /client/all
 * @apiName postClientNew
 * @apiGroup Client
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *     'client': client,
        "profile": profile,
        "settings": settings
 *  }
 */
exports.postClientNew = (req, res) => {
    let nameCheck = invalid.valueMustBeAName(req,res,req.body.clientName,true,"client name not correctly filled in");
    let firmCheck = invalid.valueMustBeAName(req,res,req.body.firm,false,"firm name not correctly filled in");
    let streetCheck = invalid.valueMustBeAName(req,res,req.body.street,true);
    let streetNrCheck = invalid.valueMustBeStreetNumber(req,res,req.body.streetNr);
    let emailCheck = false;
    req.body.emails.forEach(email => {
        if(invalid.valueMustBeEmail(req,res,email)){
            emailCheck=true;
        }
    });
    let vatCheck = invalid.valueMustBeVatNumber(req,res,req.body.vat);
    let vatPercentageCheck = invalid.valueMustBeAnInteger(req,res,req.body.vatPercentage,true);
    let bankCheck = invalid.valueMustBeValidIban(req,res,req.body.bankNr);
    let postalCheck = invalid.valueMustBePostalCode(req,res,req.body.postal);
    let placeCheck = invalid.valueMustBeAName(req,res,req.body.place,true,"place name not correctly checked in");
    let isNotValid = nameCheck||firmCheck||streetCheck||vatPercentageCheck||streetNrCheck||emailCheck||vatCheck||bankCheck||postalCheck||placeCheck;
    if(isNotValid){
        console.log('[error]: making client, not valid');
        Settings.findOne({fromUser:req.session._id},function(err, settings) {
            if(err) console.trace();
            Profile.findOne({fromUser:req.session._id},function(err,profile) {
                if(err) console.trace();
                if (!err) {
                    res.render('edit/edit-client', {
                        "settings": settings,
                        "profile":profile,
                        "currentUrl":"clientNew",
                        "client" : {
                            "clientName":req.body.clientName,
                            "firm":req.body.firm,
                            "street":req.body.street,
                            "streetNr":req.body.streetNr,
                            "vat":req.body.vat,
                            "bankNr":req.body.bankNr,
                            "postal":req.body.postal,
                            "place":req.body.place,
                            "vatPercentage":req.body.vatPercentage
                        }
                    });
                }
            });
        });
    }else{
        let newClient = new Client({
            firm: req.body. firm,
            clientName: req.body.clientName,
            street: req.body.street,
            streetNr: req.body.streetNr,
            postal: req.body.postal,
            place: req.body.place,
            vat: req.body.vat,
            lang: req.body.lang,
            email: req.body.emails,
            bankNr: req.body.rekeningnr,
            fromUser:req.session._id,
            vatPercentage: req.body.vatPercentage,
            invoices:[]
        });
        newClient.save();
        res.redirect('/client/all');
    }
};

/**
 * @api {get} /client/view/:idc getClientView
 * @apiDescription Shows all the information of the clients id from query parameter 'idc'
 * @apiName getClientView
 * @apiGroup Client
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *     'client': client,
        "profile": profile,
        "settings": settings
 *  }
 */
exports.getClientView = (req, res) => {
    Client.findOne({fromUser:req.session._id,_id: req.params.idc}, function(err, client) {
        if(err) console.trace(err);
        if (!err) {
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if(err) console.trace(err);
                if (!err) {
                    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                        if(err) console.trace(err);
                        if (!err) {
                            res.render('view/view-client', {
                                'client': client,
                                "profile": profile,
                                "settings": settings
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.getEditClient = (req,res) => {
  Client.findOne({fromUser:req.session._id,_id:req.params.idc} , function(err,client){
      if (!error.findOneHasError(req, res, err, client)) {
          Settings.findOne({fromUser: req.session._id}, function (err, settings) {
              if (!error.findOneHasError(req, res, err, settings)){
                Profile.findOne({fromUser:req.session._id},function(err,profile){
                    if(!error.findOneHasError(req,res,err,profile)){
                          res.render('edit/edit-client',{
                              'client':client,
                              'profile':profile,
                              'settings':settings,
                              "currentUrl":"clientEdit"
                          })
                    }
                });
              }
          });
      }
  });
};

exports.postEditClient = (req,res) => {
  Client.findOne({fromUser:req.session._id,_id:req.params.idc},function(err,client){
      if(!error.findOneHasError(req,res,err,client)){
          console.log("found client that is editing: "+JSON.stringify(client));
          let nameCheck = invalid.valueMustBeAName(req,res,req.body.clientName,true,"client name not correctly filled in");
          let firmCheck = invalid.valueMustBeAName(req,res,req.body.firm,false,"firm name not correctly filled in");
          let streetCheck = invalid.valueMustBeAName(req,res,req.body.street,true);
          let streetNrCheck = invalid.valueMustBeStreetNumber(req,res,req.body.streetNr);
          let emailCheck = invalid.valueMustBeEmail(req,res,req.body.email);
          let vatCheck = invalid.valueMustBeVatNumber(req,res,req.body.vat);
          let vatPercentageCheck = invalid.valueMustBeAnInteger(req,res,req.body.vatPercentage,true);
          let bankCheck = invalid.valueMustBeValidIban(req,res,req.body.bankNr);
          let postalCheck = invalid.valueMustBePostalCode(req,res,req.body.postal);
          let placeCheck = invalid.valueMustBeAName(req,res,req.body.place,true,"place name not correctly checked in");
          let isNotValid = nameCheck||firmCheck||streetCheck||vatPercentageCheck||streetNrCheck||emailCheck||vatCheck||bankCheck||postalCheck||placeCheck;
          if(!isNotValid) {
              let updatedClient = {
                  clientName:req.body.clientName,
                  firm: req.body.firm,
                  street:req.body.street,
                  streetNr:req.body.streetNr,
                  email:req.body.email,
                  vat:req.body.vat,
                  vatPercentage:req.body.vatPercentage,
                  bankNr:req.body.bankNr,
                  postal:req.body.postal,
                  place:req.body.place
              };
              console.log('Looking for client with : {fromUser: '+req.session._id+" , _id: "+client._id);
              Client.updateOne({fromUser:req.session._id,_id:client._id},updatedClient,function(err){
                 if(!error.updateOneHasError(req,res,err)){
                     req.flash('success',i18n.__("Successfully updated client"));
                     res.redirect('/client/all');
                 }
              });
          }else{
              res.redirect('/edit/client/'+client._id);
          }
      }
  })
};