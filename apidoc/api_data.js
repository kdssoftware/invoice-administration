define({ "api": [
  {
    "type": "get",
    "url": "/calc/all",
    "title": "getCalcAll",
    "description": "<p>Here you can view all the calculations and navigate to the specific one.</p>",
    "name": "getCalcAll",
    "group": "Calc",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    'currentUrl':'calc',\n       'settings': settings,\n       'description': \"Settings\",\n       'profile':profile\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/calcController.js",
    "groupTitle": "Calc"
  },
  {
    "type": "get",
    "url": "/client/all",
    "title": "getClientAll",
    "description": "<p>Here you can view all the clients from the current user</p>",
    "name": "getClientAll",
    "group": "Client",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    'clients': clients,\n       \"settings\": settings,\n       \"profile\":profile,\n       \"currentUrl\":\"clientAll\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/clientController.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/client/new",
    "title": "getClientNew",
    "description": "<p>Shows a form that creates a new client</p>",
    "name": "getClientNew",
    "group": "Client",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"settings\": settings,\n       \"profile\":profile,\n       \"currentUrl\":\"clientNew\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/clientController.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/client/view/:idc",
    "title": "getClientView",
    "description": "<p>Shows all the information of the clients id from query parameter 'idc'</p>",
    "name": "getClientView",
    "group": "Client",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   'client': client,\n       \"profile\": profile,\n       \"settings\": settings\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/clientController.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/client/new",
    "title": "postClientNew",
    "description": "<p>creates a new client for the specific user, renders /client/all</p>",
    "name": "postClientNew",
    "group": "Client",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   'client': client,\n       \"profile\": profile,\n       \"settings\": settings\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/clientController.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/edit/profile",
    "title": "edit_profile_get",
    "name": "edit_profile_get",
    "description": "<p>this will redirect to view_profile_get</p>",
    "group": "Edit",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profileController.js",
    "groupTitle": "Edit"
  },
  {
    "type": "post",
    "url": "/edit/profile",
    "title": "edit_profile_post",
    "name": "edit_profile_post",
    "description": "<p>The profile will be updated with all its given parameters in the form Afterwards will be redirected to /view/profile</p>",
    "group": "Edit",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profileController.js",
    "groupTitle": "Edit"
  },
  {
    "type": "get",
    "url": "/settings/change/text",
    "title": "change_text_post",
    "name": "change_text_post",
    "description": "<p>Updates the settings invoiceText, creditText and offerText of the current user aftwards redirects to /settings</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/settings",
    "title": "settings_all_get",
    "name": "settings_all_get",
    "description": "<p>Renders the main settings view where the user can edit there theme, footnotes and vat</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n       'currentUrl': 'settings',\n       'settings': settings,\n       'description': \"Settings\",\n       'profile':profile\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/settings/change/lang/:lang",
    "title": "settings_change_lang_Get",
    "name": "settings_change_lang_get",
    "description": "<p>Changes the settings locale to the chosen language Also changes the locals and locale session to the chosen language Afterwards redirects to /settings</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/settings/change/theme/:theme",
    "title": "settings_change_theme_get",
    "name": "settings_change_theme_get",
    "description": "<p>Updates the theme in the settings of the current user afterwards redirects to /settings</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/stock/all",
    "title": "stock_all_get",
    "name": "stock_all_get",
    "description": "<p>Renders the stock with all Items sorted by name</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n       'currentUrl':'stock',\n       'stock': stock,\n       'settings': settings,\n       \"profile\":profile\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/stockController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/stock/new/item",
    "title": "stock_new_item_get",
    "name": "stock_new_item_get",
    "description": "<p>renders new/new-item, here the user can create a new item</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n       'settings': settings,\n       \"profile\": profile,\n       \"currentUrl\":\"stockNew\"\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/stockController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/stock/new/item",
    "title": "stock_new_item_get",
    "name": "stock_new_item_get",
    "description": "<p>renders new/new-item, here the user can create a new item</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n       'settings': settings,\n       \"profile\": profile,\n       \"currentUrl\":\"stockNew\"\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/stockController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/view/profile",
    "title": "view_profile_get",
    "description": "<p>On this page you can edit all the profile information and shows the current logo picture</p>",
    "name": "view_profile_get",
    "group": "View",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    'currentUrl':\"edit-profile\",\n       'profile': profile,\n       'offerNrCurrent': Number(jaar + nroff_str),\n       'invoiceNrCurrent': Number(jaar + nr_str),\n       'creditNrCurrent': Number(jaar + nrcred_str),\n       \"settings\": settings\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profileController.js",
    "groupTitle": "View"
  }
] });
