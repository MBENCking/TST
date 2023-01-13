sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("odata.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress : function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("Firstname", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject : function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/UXTeam".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        }, 

        handleCreation(){
            if (!this._createFragment) {
				this._createFragment = sap.ui.xmlfragment(this.getView().getId(),
					"odata.view.fragments.create", this);
				this.getView().addDependent(this._createFragment)
			}
			this._createFragment.open()

          
        },

        onCancel() {
			this._createFragment.close()
		},



        onCreate(oEvent) {
            debugger
            var firstname = this.getView().byId("fname"),
                lastname = this.getView().byId("lname"),
                role = this.getView().byId("flname"),
                aage = this.getView().byId("aage"),
                that = this;

            var oModel = this.getModel()

            var oPayload = {
                Firstname : firstname.getValue(),
                Lastname : lastname.getValue(), 
                Age :  aage.getValue(),
                Role : role.getValue()
               




               // BusinessPartnerCategory : category.getSelectedKey(), 
               // OrganizationBPName1 : bp.getValue(), 
               // to_BusinessPartnerAddress : [ { Country : "DE", StreetName : "Dietmar-Hopp-Allee 16", PostalCode : "69190", CityName : "Walldorf", to_AddressUsage : [ { AddressUsage : "XXDEFAULT" } ] } ], 
               // to_BusinessPartnerTax : [ { BPTaxType:"DE0", BPTaxNumber: "DE012345678" }] 
            }


            oModel.create("/UXTeam", oPayload, 
            {
				success:function(oData,oResponse){
                        that._createFragment.close()
                        sap.m.MessageBox.success(`The business partner ${oData. Firstname} was successfully created`);
                        that.getView().byId("table").updateBindings(true);                    
                    },
                error: function(oError){
                    sap.m.MessageBox.error("Error");
                    }
                });

		},

        
        handleDelete(oEvent){
            var oItemPath = oEvent.getSource().getParent().getBindingContextPath(),
                oModel = this.getModel();

            oModel.remove(oItemPath, {
                    success:function(oData,oResponse){
                        sap.m.MessageBox.success("Success");                         
                                },
                            error: function(oError){
                                sap.m.MessageBox.error("Error");
                                }
                            });
        },

        handleEdit(){
            var oTable = this.getView().byId("table"),
            oModel = this.getModel(),
            oSettingsModel = this.getModel("Settings"),
            oSelectedItem;


            if (oTable.getSelectedItem()){
                oSelectedItem =  oModel.getObject(oTable.getSelectedItem().getBindingContextPath())
                oSettingsModel.setProperty("/SelectedObject", oSelectedItem)

                if (!this._editFragment) {
                    this._editFragment = sap.ui.xmlfragment(this.getView().getId(),
                        "odata.view.fragments.edit", this);
                    this.getView().addDependent(this._editFragment)
                }
                this._editFragment.open()

            } else {
                sap.m.MessageBox.error("You need to select one item from the table first");
            }
           
          
        },

        onCancelEdit() {
			this._editFragment.close()
		},

        onUpdate: function(oEvent){
            var oModel = this.getModel(),
                oTable = this.getView().byId("table"),
                oSettingsModel = this.getModel("Settings"),
                oSelectedItem = oSettingsModel.getProperty("/SelectedObject"),
                that = this

                var oPayload = {
                    Firstname: oSelectedItem.Firstname,
                    Lastname: oSelectedItem.Lastname,
                    Age: oSelectedItem.Age,
                    Role: oSelectedItem.Role,
                    Salary: oSelectedItem.Salary,
                    Active: oSelectedItem.Actives
                    
                    
                }
 
                oModel.update(oTable.getSelectedItem().getBindingContextPath(), oPayload, 
                {
                    success:function(oData,oResponse){
                            that.getView().byId("table").updateBindings(true);  
                            that._editFragment.close()
                            sap.m.MessageBox.success(`Korisnik was updated`)
               
                        },
                    error: function(oError){

                        sap.m.MessageBox.error("Error");
                        }
                });
        },

        Aktiviraj:function(){

            debugger
            var oModel = this.getModel(),
            oTable = this.getView().byId("table"),
            oSettingsModel = this.getModel("Settings"),
            oSelectedItem = oSettingsModel.getProperty("/SelectedObject"),
            that = this

            var oPayload = {
                Active: 'True'
                
                
            }

            oModel.update(oTable.getSelectedItem().getBindingContextPath(), oPayload, 
            {
                success:function(oData,oResponse){
                        that.getView().byId("table").updateBindings(true);  
                      
                        sap.m.MessageBox.success(`Korisnik was updated`)
           
                    },
                error: function(oError){

                    sap.m.MessageBox.error("Error");
                    }
            });

        }





    });
});
