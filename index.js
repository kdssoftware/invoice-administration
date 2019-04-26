var path=require('path');
var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var app=express();

// Form Data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Database Connectivity
mongoose.connect('mongodb://localhost:27017/sample-website');
mongoose.connection.on('open',function() {
    console.log('Mongoose connected.');
});
var maand = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];
Schema=mongoose.Schema;

var SettingsSchema = new Schema({
  thema:{type:String,default:"secondary"},
  oppo:{type:String,default:"light"},
  nav:{type:String,default:"dark"}
});

var Settings=mongoose.model('Settings',SettingsSchema);

// Creat Task Schema
var ProfileSchema=new Schema({
  firma:{type:String},
  naam:{type:String},
  straat:{type:String},
  straatNr:{type:String},
  postcode:{type:String},
  plaats:{type:String},
  btwNr:{type:String},
  iban:{type:String},
  bic:{type:String},
  nr:{type:Number,default:1},
  tele:{type:String},
  mail:{type:String}
});

var Profile=mongoose.model('Profile',ProfileSchema);

var BestellingSchema=new Schema({
    beschrijving:{type:String},
    aantal:{type:Number},
    bedrag:{type:Number},
    factuur:{type: Schema.Types.ObjectId, ref:'Factuur'},
    totaal:{type:Number}
})

var Bestelling=mongoose.model('Bestelling',BestellingSchema);

var FactuurSchema=new Schema({
    datum:{type:String},
    factuurNr:{type:Number},
    aantalBestellingen:{type:Number,default:0},
    contact: {type: Schema.Types.ObjectId, ref:'Contact'},
    bestellingen: [{type: Schema.Types.ObjectId, ref:'Bestelling'}],
    isBetaald : {type:Boolean,default:false},
    voorschot : {type: Number, default:0}
})

var Factuur=mongoose.model('Factuur',FactuurSchema);

var ContactSchema=new Schema({
    firma:{type:String},
    contactPersoon:{type:String},
    straat:{type:String},
    straatNr:{type:String},
    postcode:{type:String},
    plaats:{type:String},
    btwNr:{type:String},
    facturen: [{type: Schema.Types.ObjectId,ref:'Factuur'}],
    aantalFacturen:{type:Number,
      default:0
    }
});

var Contact=mongoose.model('Contact',ContactSchema);

app.get('/',function(req,res){
    console.log("-------------------------------------------------------------------------")
    console.log("#localhost:3000/ GET");
    Contact.find({},function(err,docs){
      Settings.find({},function(err,settings){
        if(!err && settings.length!=0){
          console.log("settings found "+settings[0]);
        }else{
          console.log("ERR: settings not found!");
          console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
          legeSettings = new Settings();
          legeSettings.save(function(err){
              if(err){
                  console.log("err in settings: "+err);
              }
          });
        }
        res.render('contacten',{'contactenLijst':docs,'description':"MDSART factuurbeheer","settings":settings[0]});
      });
    });
});

app.get('/add-contact',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#add-contact GET");
    Settings.find({},function(err,settings){
      if(!err && settings.length!=0){
        console.log("settings found "+settings[0]);
      }else{
        console.log("ERR: settings not found!");
        console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
        legeSettings = new Settings();
        legeSettings.save(function(err){
            if(err){
                console.log("err in settings: "+err);
            }
        });
      }
      res.render('add-contact',{'description':"Contact toevoegen","settings":settings[0]});
    });
});


app.post('/add-contact',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#add-contact POST");
    if(
        req.body.contactPersoon &&
        req.body.straat &&
        req.body.plaats){
        var newContact=new Contact({
          firma:req.body.firma,
          contactPersoon:req.body.contactPersoon,
          straat:req.body.straat,
          straatNr:req.body.straatNr,
          postcode:req.body.postcode,
          plaats:req.body.plaats,
          btwNr:req.body.btwNr
        });
        var message='Contact toegevoegd';
        newContact.save(function(err){
            if(err){
                var message='Contact niet toegevoegd';
            }
        });
    }
    Settings.find({},function(err,settings){
      if(!err && settings.length!=0){
        console.log("settings found "+settings[0]);
      }else{
        console.log("ERR: settings not found!");
        console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
        legeSettings = new Settings();
        legeSettings.save(function(err){
            if(err){
                console.log("err in settings: "+err);
            }
        });
      }
      res.render('add-contact',{msg:message,"description":"Contact toevoegen","settings":settings[0]});
    });
});

app.post('/add-bestelling/:idf',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#add-bestelling POST");
  Factuur.findOne({_id:req.params.idf},function(err,factuur){
    if(!err){
          var newBestelling=new Bestelling({
            beschrijving:req.body.beschrijving,
            aantal:req.body.aantal,
            bedrag:req.body.bedrag,
            factuur:req.params.idf,
            totaal:req.body.aantal*req.body.bedrag
          })
          newBestelling.save(function(err){
            if(err){
              console.log(err);
            }
          });
          res.redirect('/bestellingen/'+req.params.idf);
        }
      });
});

app.get('/add-bestelling/:idf',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#add-bestelling GET");
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
      if(!err){
        Settings.find({},function(err,settings){
          if(!err && settings.length!=0){
            console.log("settings found "+settings[0]);
          }else{
            console.log("ERR: settings not found!");
            console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
            legeSettings = new Settings();
            legeSettings.save(function(err){
                if(err){
                    console.log("err in settings: "+err);
                }
            });
          }
          res.render('add-bestelling',{'factuur':factuur,"description":"Bestelling toevoegen","settings":settings[0]});
        });
      }
    });
});

app.get('/edit-bestelling/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-bestelling GET");
  Bestelling.findOne({_id:req.params.id},function(err,bestelling){
    Factuur.findOne({_id:bestelling.factuur},function(err,factuur){
      Settings.find({},function(err,settings){
        if(!err && settings.length!=0){
          console.log("settings found "+settings[0]);
        }else{
          console.log("ERR: settings not found!");
          console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
          legeSettings = new Settings();
          legeSettings.save(function(err){
              if(err){
                  console.log("err in settings: "+err);
              }
          });
        }
      res.render('edit-bestelling',{'bestelling':bestelling,"factuur":factuur,"description":"Bestelling aanpassen","settings":settings[0]});
    });
    });
  });
});

app.post('/edit-bestelling/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-bestelling POST");
  console.log("looking for bestelling with id:"+req.params.id);
  var updateBestelling={
    beschrijving:req.body.beschrijving,
    aantal:req.body.aantal,
    bedrag:req.body.bedrag,
    totaal:req.body.aantal*req.body.bedrag
  }
  Bestelling.update({_id:req.params.id},updateBestelling,function(err,numrows){
    Bestelling.findOne({_id:req.params.id},function(err,bestelling){
        if(!err){
          res.redirect('/bestellingen/'+bestelling.factuur);
        }else{
          console.log("err edit-bestelling POST : "+err);
        }
    });
  });
});

app.get('/edit-contact/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-contact GET");
    Contact.findOne({_id:req.params.id},function(err,docs){
      Settings.find({},function(err,settings){
        if(!err && settings.length!=0){
          console.log("settings found "+settings[0]);
        }else{
          console.log("ERR: settings not found!");
          console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
          legeSettings = new Settings();
          legeSettings.save(function(err){
              if(err){
                  console.log("err in settings: "+err);
              }
          });
        }
        res.render('edit-contact',{'contact':docs,"description":"Contact aanpassen","settings":settings[0]});
      });
    });
});

//request pdf generation
app.get('/createPDF/:idf', function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#create-pdf");
  var id = req.params.id;

  Profile.find({},function(err,profile){
    console.log("found profile: "+profile);
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
      console.log("found factuur: "+factuur);
      if(err)
        console.log("err: "+err);
      Contact.findOne({_id:factuur.contact},function(err2,contact){
        if(err2)
          console.log("err: "+err2);
        Bestelling.find({factuur:factuur._id},function(err3,bestellingen){
          console.log("found :"+bestellingen);
          if(err3){
            console.log("err: "+err3);
          }
          var lengte=Number(bestellingen.length);
          var json_data = "[";
          for(var i = 0; i<= lengte-1;i++){
            console.log("adding "+bestellingen[i]+"...");
            json_data +=("{\"beschrijving\" : \""+bestellingen[Number(i)].beschrijving+"\", "
                            +"\"aantal\" : "+bestellingen[Number(i)].aantal+", "
                            +"\"bedrag\" : "+bestellingen[Number(i)].bedrag+", "
                            +"\"totaal\" : "+Number(bestellingen[Number(i)].aantal*bestellingen[Number(i)].bedrag)+" }");
            if(i <= lengte-2){
              json_data +=",";
            }
          }
          json_data += "]";
          console.log("#BESTELLINGEN => "+json_data);
          Settings.find({},function(err,settings){
            if(!err && settings.length!=0){
              console.log("settings found "+settings[0]);
            }else{
              console.log("ERR: settings not found!");
              console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
              legeSettings = new Settings();
              legeSettings.save(function(err){
                  if(err){
                      console.log("err in settings: "+err);
                  }
              });
            }
          res.render('pdf',{'profile':profile[0],'contact':contact,'bestellingen':json_data,"factuur":factuur,'lengte':lengte,"settings":settings[0]});
        });
        });
      });
    });
  });
});

app.post('/edit-contact/:id',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#edit-contact : idc:"+req.params.id);
    var updateData={
      firma:req.body.firma,
      contactPersoon:req.body.contactPersoon,
      straat:req.body.straat,
      straatNr:req.body.straatNr,
      postcode:req.body.postcode,
      plaats:req.body.plaats,
      btwNr:req.body.btwNr,
    };
    var message='Factuur niet geupdate';
    Contact.update({_id:req.params.id},updateData,function(err,numrows){
        if(!err){
            res.redirect('/edit-contact/'+req.params.id);
        }
    });
});

app.get('/add-factuur/:idc',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#add factuur");
  var date=new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate()+" "+maand[date.getMonth()]+" "+jaar;
  console.log(datum);
  var nr = 0;
  var idn;
  var _n = null;
  var factuurID;
  Contact.findOne({_id:req.params.idc},function(err,contact){
    if(!err){
      contact.save(function(err){
        if(!err){
          Profile.find({},function(err,nummer){
              if(!err){
                console.log("profile: "+nummer);
                var _n = nummer;
                nr = nummer[0].nr;
              }
              nummer[0].save(function(err){
                Profile.updateOne({nr:nr+1},function(err){
                  if(err){
                    console.log("error in profile: "+err);
                  }else{
                    var nr_str = nr.toString();
                    if(nr_str.toString().length == 1){
                      nr_str = "00"+nr.toString();
                    }else if(nr_str.toString().length == 2){
                      nr_str = "0"+nr.toString();
                    }

                    console.log("updating nr in profile");
                    console.log("getting factuur nr: "+jaar+nr_str);
                    const newFactuur = new Factuur({
                      contact: contact._id,
                      datum: datum,
                      factuurNr: String(jaar+nr_str)
                    });
                    Contact.updateOne({aantalFacturen:contact.aantalFacturen+1},function(err){
                      if(err){
                        console.log("err contact.updateOne: "+err);
                      }else{
                        contact.facturen.push(newFactuur._id);
                      }
                    });
                    newFactuur.save(function(err){
                      if(err){
                        console.log("err newFactuur: "+err);
                      }
                    });
                    Factuur.find({contact:req.params.idc},function(err,facturen){
                    if(!err){
                      res.redirect('/facturen/'+contact._id);
                        }else{
                      console.log("err factuur.find: "+err);
                    }
                    });
                  }
                });
              });
            });
        }else{
          console.log("err contact.save: "+ err);
        }
      });
    }
  });
});

app.get('/delete-contact/:id',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#delete-contact GET");
    Contact.remove({_id:req.params.id},function(err){
        if(!err){
        }
    });
    Contact.find({},function(err,contacten){
      Settings.find({},function(err,settings){
        if(!err && settings.length!=0){
          console.log("settings found "+settings[0]);
        }else{
          console.log("ERR: settings not found!");
          console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
          legeSettings = new Settings();
          legeSettings.save(function(err){
              if(err){
                  console.log("err in settings: "+err);
              }
          });
        }
        res.render('contacten',{'contactenLijst':contacten,"settings":settings[0]});
      });
    });
});

app.get('/delete-factuur/:idc/:idf',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#delete-factuur GET");
    Contact.findOne({_id:req.params.idc},function(err,contact){
        Factuur.deleteOne({_id:req.params.idf},function(err){
          if(!err){
            Factuur.find({contact:req.params.idc},function(err,facturen){
              if(!err){
                console.log("succesfully deleted factuur ( id:"+req.params.idf+" )");
                Settings.find({},function(err,settings){
                  if(!err && settings.length!=0){
                    console.log("settings found "+settings[0]);
                  }else{
                    console.log("ERR: settings not found!");
                    console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
                    legeSettings = new Settings();
                    legeSettings.save(function(err){
                        if(err){
                            console.log("err in settings: "+err);
                        }
                    });
                  }
                res.render('facturen',{'contact':contact,'facturenLijst':facturen,'description':"Facturen van "+contact.contactPersoon,"settings":settings[0]});
              });
                }else{
                console.log("err factuur.find: "+err);
              }
            });

            }else{
            console.log("err factuur.deleteOne: "+err);
          }
        });
    });
});

app.get('/delete-bestelling/:idb',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#delete-bestelling GET");
    Bestelling.findOne({_id:req.params.idb},function(err,bestelling){
      Factuur.findOne({_id:bestelling.factuur},function(err,factuur){
          Bestelling.deleteOne({_id:req.params.idb},function(err){
                if(!err){
                  console.log("succesfully deleted bestelling ( id:"+req.params.idb+" )");
                  console.log(factuur);
                  res.redirect('/bestellingen/'+factuur._id);
                  }else{
                  console.log("err bestelling.find: "+err);
                  }
          });
      });
    });
});

app.get('/facturen/:idc',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#facturen GET : idc:"+req.params.idc);
    var contact;
    Contact.findOne({_id:req.params.idc},function(err,_contact){
      if(!err){
        contact=_contact;
        Factuur.find({contact:req.params.idc},function(err,facturen){
        if(!err){
            console.log(facturen);
            Settings.find({},function(err,settings){
              if(!err && settings.length!=0){
                console.log("settings found "+settings[0]);
              }else{
                console.log("ERR: settings not found!");
                console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
                legeSettings = new Settings();
                legeSettings.save(function(err){
                    if(err){
                        console.log("err in settings: "+err);
                    }
                });
              }
            res.render('facturen',{'contact':contact,'facturenLijst':facturen,'description':"Facturen van "+contact.contactPersoon,"settings":settings[0]});
          });
        }else{
          console.log("err factuur.find: "+err);
        }
        });
      }else{
        console.log("err contact.findOne: "+err);
      }
    });
});

app.get('/bestellingen/:idf',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#bestellingen GET");
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
      if(!err){
        Contact.findOne({_id:factuur.contact},function(err,contact){
          if(!err){
            console.log("factuur succesfully found: "+factuur);
            console.log("factuur id :"+factuur._id);
            Bestelling.find({factuur:req.params.idf},function(err,bestellingen){
              if(!err){
                console.log("bestelling succesfully found: "+bestellingen);
                Settings.find({},function(err,settings){
                  if(!err && settings.length!=0){
                    console.log("settings found "+settings[0]);
                  }else{
                    console.log("ERR: settings not found!");
                    console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
                    legeSettings = new Settings();
                    legeSettings.save(function(err){
                        if(err){
                            console.log("err in settings: "+err);
                        }
                    });
                  }
                res.render('bestellingen',{'factuur':factuur,'bestellingen':bestellingen,'description':"Bestellingen van "+contact.contactPersoon+" ("+factuur.factuurNr+")","settings":settings[0]});
              });
                }
            });
          }
        });
      }
    });
});

app.get('/view-contact/:idc',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#view-contact GET");
  Contact.findOne({_id:req.params.idc},function(err,contact){
    if(!err){
      Settings.find({},function(err,settings){
        if(!err && settings.length!=0){
          console.log("settings found "+settings[0]);
        }else{
          console.log("ERR: settings not found!");
          console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
          legeSettings = new Settings();
          legeSettings.save(function(err){
              if(err){
                  console.log("err in settings: "+err);
              }
          });
        }
          res.render('view-contact',{'contact':contact,"description":"Contact Bekijken","settings":settings[0]});
        });
    }else{
      console.log("err view-contact: "+err);
    }
  });
});


// Show the Index Page
app.get('/',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("localhost:3000 render");
    Settings.find({},function(err,settings){
      if(!err && settings.length!=0){
        console.log("settings found "+settings[0]);
      }else{
        console.log("ERR: settings not found!");
        console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
        legeSettings = new Settings();
        legeSettings.save(function(err){
            if(err){
                console.log("err in settings: "+err);
            }
        });
      }
    res.render('contacten',{"description":"Contacten","settings":settings[0]});
  });
});

app.get('/edit-profile/',function(req,res){
      console.log("-------------------------------------------------------------------------");
      console.log("#edit-profile GET");
      var legeProfiel;
      var date = new Date();
      var _jaar = date.getFullYear();
      var jaar = _jaar.toString();
      Profile.find({},function(err,profile){
            if(!err){
                  if(profile.length==0){
                        console.log("profiel is nog niet gemaakt, nieuwe word gecreërd");
                        legeProfiel = new Profile();
                        legeProfiel.save(function(err){
                            if(err){
                                console.log("err edit-profile: "+err);
                            }
                        });
                        console.log(legeProfiel)
                        res.render('edit-profile',{'profile':legeProfiel});
                    }else{
                        console.log("\nprofile: "+profile[0]);
                        var _nr = profile[0].nr;
                        var nr_str = _nr.toString();
                        if(nr_str.toString().length == 1){
                          nr_str = "00"+_nr.toString();
                        }else if(nr_str.toString().length == 2){
                          nr_str = "0"+_nr.toString();
                        }
                        Settings.find({},function(err,settings){
                          if(!err && settings.length!=0){
                            console.log("settings found "+settings[0]);
                          }else{
                            console.log("ERR: settings not found!");
                            console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
                            legeSettings = new Settings();
                            legeSettings.save(function(err){
                                if(err){
                                    console.log("err in settings: "+err);
                                }
                            });
                          }
                        res.render('edit-profile',{'profile':profile[0],'nr':Number(jaar+nr_str),"description":"Profiel bijwerken","settings":settings[0]});
                      });
                    }
              }
      });
});

app.post('/edit-profile/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-profile POST");
  var _nr2 = req.body.nr.toString();
  var _nr = Number(_nr2.substring(_nr2.length-3));
  var updateProfile={
    firma:req.body.firma,
    naam:req.body.naam,
    straat:req.body.straat,
    straatNr:req.body.straatNr,
    postcode:req.body.postcode,
    plaats:req.body.plaats,
    btwNr:req.body.btwNr,
    iban:req.body.iban,
    bic:req.body.bic,
    nr:_nr,
    tele: req.body.tele,
    mail: req.body.mail
  }
  Profile.update({_id:req.params.id},updateProfile,function(err,updatedprofile){
    if(!err){
      res.redirect('/');
    }else{
      console.log(err);
    }
  });
});

app.get('/edit-factuur/:idc/:idf',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-factuur GET");
  Contact.findOne({_id:req.params.idc},function(err,contact){
    console.log("contact succesfully found: "+contact );
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
      if(!err){
          console.log("factuur succesfully found : "+factuur);
          Settings.find({},function(err,settings){
            if(!err && settings.length!=0){
              console.log("settings found "+settings[0]);
            }else{
              console.log("ERR: settings not found!");
              console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
              legeSettings = new Settings();
              legeSettings.save(function(err){
                  if(err){
                      console.log("err in settings: "+err);
                  }
              });
            }
          res.render('edit-factuur',{'factuur':factuur,'contact':contact,"description":"Factuur aanpassen van "+contact.contactPersoon,"settings":settings[0]});
        });
      }else{
        console.log("err edit-factuur GET: "+err);
      }
    });
  });
});

app.post('/edit-factuur/:idc/:idf',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-factuur POST");
  var updateFactuur={
    datum:req.body.datum,
    factuurNr:req.body.factuurNr,
    voorschot:req.body.voorschot
  };
  Contact.findOne({_id:req.params.idc},function(err,contact){
    console.log(contact)
    Factuur.update({_id:req.params.idf},updateFactuur,function(err,factuur){
      if(!err){
        console.log(factuur);
        res.redirect('/facturen/'+contact._id);
      }else{
        console.log(err);
      }
    });

  });
});

app.get('/view-factuur/:idf',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-factuur GET");
  Factuur.findOne({_id:req.params.idf},function(err,factuur){
    if(!err){
      console.log("factuur succesfully found: "+factuur);
      Contact.findOne({_id:factuur.contact},function(err,contact){
        console.log("contact from factuur succesfully found: "+contact);
        Settings.find({},function(err,settings){
          if(!err && settings.length!=0){
            console.log("settings found "+settings[0]);
          }else{
            console.log("ERR: settings not found!");
            console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
            legeSettings = new Settings();
            legeSettings.save(function(err){
                if(err){
                    console.log("err in settings: "+err);
                }
            });
          }
        res.render('view-factuur',{'factuur':factuur,'contact':contact,"description":"Bekijk factuur van "+contact.contactPersoon+" ("+factuur.factuurNr+")","settings":settings[0]});
      });
      });
    }
  });
});

app.get('/view-bestelling/:idb',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#view-bestelling GET");
  Bestelling.findOne({_id:req.params.idb},function(err,bestelling){
    if(!err){
      Factuur.findOne({_id:bestelling.factuur},function(err,factuur){
        if(!err){
          Settings.find({},function(err,settings){
            if(!err && settings.length!=0){
              console.log("settings found "+settings[0]);
            }else{
              console.log("ERR: settings not found!");
              console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
              legeSettings = new Settings();
              legeSettings.save(function(err){
                  if(err){
                      console.log("err in settings: "+err);
                  }
              });
            }
          res.render('view-bestelling',{'bestelling':bestelling,"factuur":factuur,"description":"Bekijk bestelling","settings":settings[0]});
        });
        }
      });
    }
  });
});

app.get('/change-betaald/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#change-betaald GET");
  Factuur.findOne({_id:req.params.id},function(err,factuur){
    if(!err){
      console.log("factuur found: "+factuur);
      var voor = new Boolean();
      voor = !(factuur.isBetaald);
      console.log("betaald now: "+voor);
      //update(req.params.idf,voor);
      Factuur.updateOne({_id:req.params.idf},{isBetaald:voor},function(err,result){
        if(!err){
          res.redirect('/facturen/'+factuur.contact);
        }
      });
    }
  });
});

app.get('/settings',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#settings GET");
  Settings.find({},function(err,settings){
    if(!err && settings.length!=0){
    console.log("settings found "+settings[0]);
    res.render('settings',{'settings':settings[0],'description':"Settings"});
  }else{
      console.log("ERR: settings not found!");
      console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
      legeSettings = new Settings();
      legeSettings.save(function(err){
          if(err){
              console.log("err in settings: "+err);
          }
      });
      console.log(legeSettings);
      res.redirect('/settings');
      if(err){
        console.log(err);
      }
    }
  });
});
app.get('/change-theme/:th',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#change-theme POST");
  Settings.find({},function(err,settings){
    if(!err){
      console.log("found settings "+settings[0]);
      var oppo;
      var nav;
      if(req.params.th=="dark"){
        oppo = "light";
        nav= "dark";
      }else if(req.params.th=="primary"){
        oppo = "outline-primary";
        nav="dark";
      }else if(req.params.th=="light"){
        oppo = "secondary";
        nav="light";
      }else if(req.params.th=="secondary"){
        oppo = "outline-secondary";
        nav="dark";
      }
      var updateSettings={
        thema:req.params.th,
        oppo:oppo,
        nav:nav
      };
      Settings.update({_id:settings[0]._id},updateSettings,function(err,updatedSettings){
        if(!err){
          console.log("updated settings!");
          res.redirect('/settings');
        }else{
          console.log(err);
        }
      });
    }else{
      console.log("err");
      res.redirect('/');
    }
  });
});

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set Public Folder as static Path
app.use(express.static(path.join(__dirname, 'public')));

// Run the Server
app.listen('3000',function(){
    console.log('Server is running at PORT '+3000);
Schema=mongoose.Schema;

});
async function update(id,voor){
  await Factuur.updateOne({_id:id},{isBetaald:voor});
  console.log("updated");
}
