
/**
 * @author Jorge Salas <jorge.salas@beexponential.com.mx>
 * @module jsModule
 * @Name lib_recordParser.js
 * @Description parsers record values
 * @NAmdConfig ./libraries.json
 * @NApiVersion 2.x
 * @NModuleScope Public
 */
define(["N/record", "N/format", './lib_netsuitedate'], function (record, format, jsDate) {
    /**
     * transform an object to record, should be used only if submitfields original function not suit your needs, do not use it if you need to get some values of the record being cerated/transformed/updated.
     * @function submitFieldsJS
     * @param request - first level of obj are id (load/transform), recordType (mandatory), from (only in transform), isDynamic (default false), ignoreMandatoryFields (default false) and values. values is an object with property:value, netsuidFieldId: valueToSave, also, can contain netsuiteSublistId:[{}], each element of the array are newlines, the line to save can be declarated trought property lineid:value or lineSearch:{fieldId:fieldToFind, value:valueToFind}. In each element of the array are objects netsuiteSublistFieldId:valueToSave or netsuiteSublistFieldId:[{}], this will be subrecords whit the same array structure as described before.
     * @returns {{msg: string, recordId: void | number, code: number}}
     */
    /*
    ejemplos de uso

    define(['./lib_cha_jsmodule2'], function (js) {

    var inventoryassignmentObj = {};
    var inventoryassignmentArr = [];
    var inventorydetailObj = {};
    var itemObj = {};
    var itemArr = [];
    var values = {};
    var obj2createUpdateTransform = {};

ejemplo con inventoryDetail

    itemObj["lineSearch"] = {};
    itemObj["lineSearch"]["fieldId"] = "internalid";
    itemObj["lineSearch"]["value"] = invoiceId.toString();q
    itemObj["lineId"] = line - shippedCount + vspCount;
    itemObj['quantity'] = 1;
    itemObj["location"] = storeId;
    inventoryassignmentObj['lineId'] = 0;
    inventoryassignmentObj['issueinventorynumber'] = loteSerial[_i7][_j]["inventorynumber"];
    inventoryassignmentObj['binnumber'] = binNumber;
    inventoryassignmentObj['inventorystatus'] = 1;
    inventoryassignmentObj['quantity'] = 1;
    inventoryassignmentArr.push(inventoryassignmentObj);
    inventorydetailObj["inventoryassignment"] = inventoryassignmentArr;
    itemObj["inventorydetail"] = inventorydetailObj;
    itemArr.push(itemObj);
    itemObj['lineId'] = k;
    itemObj['itemreceive'] = false;
    itemArr.push(itemObj);
    values['item'] = itemArr;
    obj2createUpdateTransform['values'] = values;
    obj2createUpdateTransform['from'] = "salesorder";
    obj2createUpdateTransform['id'] = recordId;
    obj2createUpdateTransform['recordType'] = "itemfulfillment";
    obj2createUpdateTransform['isDynamic'] = true;
    log.debug('itemfulfillmentAdress' + _i7, obj2createUpdateTransform);
    var _response = js.recordParser(obj2createUpdateTransform);
    recordId = _response.recordId;

ejemplo de unsa orden de venta
    for (var _i4 = 0; _i4 < item.length; _i4++) {
        for (var j = 0; j < item[_i4].quantity; j++) {
            itemObj = {};
            itemObj["item"] = item[_i4]["itemId"];
            itemObj['quantity'] = 1;
            itemObj['rate'] = item[_i4].rate;
            itemObj['taxcode'] = item[_i4].taxCode;
            itemObj['commitinventory'] = 1;
            itemObj["orderallocationstrategy"] = -3;
            itemObj["commitmentfirm"] = true;
            itemObj["location"] = storeId;
            itemObj['custcol_bex_id_promocion'] = item[_i4].promotionId;
            itemObj['custcol_bex_cantidad_descuento'] = item[_i4].discount;
            itemObj['custcol_line_id'] = item[_i4].rowId.toString();
            itemObj['custcol_is_shipped'] = item[_i4].isShipped;
            itemArr.push(itemObj);
        }
    }

    values['entity'] = clientId;
    values['location'] = storeId;
    values['trandate'] = tranDate;
    values['memo'] = referencia;
    values['custbody_bex_operation_number'] = request.numOperation;
    values['custbody_be_sales_type'] = request.salesType;
    values['custbody_bex_cajera'] = cashierId;
    values['custbody_bex_num_maq_operacion'] = numberStation;
    values['custbody_bex_time_stamp'] = timeStamp;
    values['custbody_cha_transaction_type'] = transactionType;
    values['custbody_bex_transactionid'] = transactionId;
    values['custbody_cha_has_certificate'] = request.hasCertificate;
    values["custbody_cha_event_type"] = request.typeEvent;
    values["custbody_cha_event_number"] = request.eventId ;
    values["custbody_cha_delivery_date"] = request.deliveryDateMR;
    values["custbody_cha_delivery_frequency"] = request.deliveryFrequencyMR;
    values['orderstatus'] = 'B';
    values['item'] = itemArr;
    obj2createUpdateTransform['recordType'] = "salesorder";
    obj2createUpdateTransform['isDynamic'] = true;
    obj2createUpdateTransform['values'] = values;
    var response = js.recordParser(obj2createUpdateTransform);
    recordId = response.recordId;
});
     */
    function submitFieldsJS(request) {
        function validateType(x) {
            var status = false;

            var type = _typeof(x);

            if (type != 'function' && type != 'symbol' && type != "undefined") {
                status = true;
            }

            return status;
        }

        function parseValues(objField, value) {
            var value2 = "";
            if (objField.type == "date" || objField.type == "datetime" || objField.type == "datetimetz") {
                //var regex = RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}');//TODO mejorar deteccion de iso
                if (typeof (value) == "string" && value.indexOf("-") == 4) {
                    log.debug("if", value)

                    /*
                    var date = new Date(value);
                    var offset = date.getTimezoneOffset() * 60000+ 5*60000;
                    var time = timeError + offset;
                    time += date.getTime();
                    value = new Date(time);//*/
                    value = jsDate.parse(value);//TODO: tiempos incorrectos
                    log.debug("regex", value)
                } else {
                    log.debug("else", typeof (value) + ", " + value)
                    if (value) {
                        value2 = format.parse({
                            value: value,
                            type: objField.type
                        });
                        if (value2 == value) {
                            value = new Date(value);
                        } else {
                            value = value2;
                        }
                    }
                    log.debug("format", value)
                }
                log.debug('parse1', value);
            } else if (objField.type == "currency") {
                var requestPropertyString = value.toString();

                if (requestPropertyString.length > 20) {
                    var requestPropertyString20 = requestPropertyString.substring(19, 20);
                    var requestPropertyString21 = requestPropertyString.substring(20, 21);
                    requestPropertyString = requestPropertyString.substring(0, 19);

                    if (requestPropertyString21 > 4) {
                        requestPropertyString20++;
                    }

                    value = requestPropertyString + requestPropertyString20;
                }
            }
            return value;
        }

        log.debug('request', request);
        var timeError = 0;
        var objRecord;
        var code = 200;
        var msg = "";
        var recordId = -1;
        var ignoreMandatoryFields = false;

        if (request.ignoreMandatoryFields == true) {
            ignoreMandatoryFields = true;
        }

        if (request.isDynamic != true && request.isDynamic != false) {
            request.isDynamic = false;
        }

        log.debug("aa");

        if (request.from) {
            log.debug("a1");
            objRecord = record.transform({
                fromType: request.from,
                fromId: request.id,
                toType: request.recordType,
                isDynamic: true
            });
        } else if (!request.id) {
            log.debug("a2");
            objRecord = record.create({
                type: request.recordType,
                isDynamic: request.isDynamic
            });
            log.debug("a22");
        } else {
            log.debug("a3");
            objRecord = record.load({
                type: request.recordType,
                id: request.id,
                isDynamic: request.isDynamic
            });
        }

        log.debug("a");
        request = request.values;
        log.debug("b");
        objCrawler(objRecord, request);

        function objCrawler(objRecord, request, isSubrecord) {
            if (!isSubrecord) {
                isSubrecord = false;
            }
            var sublistName = objRecord.getSublists();
            var objFields = objRecord.getFields();

            for (var property in request) {
                if (request.hasOwnProperty(property)) {
                    if (Array.isArray(request[property])) {
                        log.debug("property is array", property);

                        if (sublistName.indexOf(property) != -1) {
                            log.debug('property is sublist', property);
                            var sublistId = property;
                            var sublistFields = objRecord.getSublistFields({
                                sublistId: sublistId
                            });
                            sublistFields.push("inventorydetail"); //TODO: inventory detail no aparece como un campo en la sublista, no la mejor solucion

                            for (var i in request[sublistId]) {
                                var emptyObj = !Object.keys(request[sublistId][i])[0];
                                log.debug("emptyObj", emptyObj);
                                if (!emptyObj) {
                                    var lineId = void 0;
                                    var lineCount = 0;
                                    if (request[sublistId][i]["lineSearch"] && request[sublistId][i]["lineSearch"]["value"]) {
                                        var line = objRecord.findSublistLineWithValue({
                                            sublistId: sublistId,
                                            fieldId: request[sublistId][i]["lineSearch"]["fieldId"],
                                            value: request[sublistId][i]["lineSearch"]["value"]
                                        });
                                        log.debug("requestlinesearch", line);
                                        request[sublistId][i]["lineId"] = line;
                                    }
                                    log.debug("isDynamic", objRecord.isDynamic);
                                    if (objRecord.isDynamic) {
                                        if (request[sublistId][i]["lineId"] || request[sublistId][i]["lineId"] == 0) {
                                            log.debug("lineSelected", request[sublistId][i].lineId);
                                            objRecord.selectLine({
                                                sublistId: sublistId,
                                                line: request[sublistId][i].lineId
                                            });
                                        } else {
                                            log.debug("newLine", sublistId);
                                            objRecord.selectNewLine({
                                                sublistId: sublistId
                                            });
                                            lineId = objRecord.getCurrentSublistIndex({
                                                sublistId: sublistId
                                            });
                                            log.debug("line", lineId);
                                        }
                                    } else {
                                        if (request[sublistId][i]["lineId"] || request[sublistId][i]["lineId"] == 0) {
                                            log.debug("lineSelected", request[sublistId][i].lineId);
                                            lineId = request[sublistId][i].lineId;
                                        } else {
                                            log.debug("natural line count", lineId);
                                            lineId = lineCount;
                                        }
                                    }
                                    for (var fieldId in request[sublistId][i]) {
                                        if (sublistFields.indexOf(fieldId) != -1) {
                                            var sublistField = void 0;
                                            if (objRecord.isDynamic && !isSubrecord) {
                                                sublistField = objRecord.getCurrentSublistField({
                                                    sublistId: sublistId,
                                                    fieldId: fieldId
                                                });
                                            } else {
                                                sublistField = objRecord.getSublistField({
                                                    sublistId: sublistId,
                                                    fieldId: fieldId,
                                                    line: lineId ? lineId : (lineId == 0 ? 0 : request[sublistId][i]["lineId"])
                                                });
                                            }

                                            if (sublistField.type == "summary") {
                                                log.debug('isSubrecord', fieldId);
                                                var objSubrecord = void 0;

                                                if (objRecord.isDynamic) {
                                                    objSubrecord = objRecord.getCurrentSublistSubrecord({
                                                        sublistId: sublistId,
                                                        fieldId: fieldId
                                                    });
                                                } else {
                                                    objSubrecord = objRecord.getSublistSubrecord({
                                                        sublistId: sublistId,
                                                        fieldId: fieldId,
                                                        line: lineId || request[sublistId][i]["lineId"]
                                                    });
                                                }

                                                objCrawler(objSubrecord, request[sublistId][i][fieldId], true);
                                            } else {
                                                log.debug(request[sublistId][i][fieldId])
                                                if (validateType(request[sublistId][i][fieldId])) {

                                                    request[sublistId][i][fieldId] = parseValues(sublistField, request[sublistId][i][fieldId]);

                                                    log.debug('fieldIdsave:' + fieldId, request[sublistId][i][fieldId]);

                                                    if (objRecord.isDynamic) {
                                                        objRecord.setCurrentSublistValue({
                                                            sublistId: sublistId,
                                                            fieldId: fieldId,
                                                            value: request[sublistId][i][fieldId]
                                                        });
                                                    } else {
                                                        objRecord.setSublistValue({
                                                            sublistId: sublistId,
                                                            fieldId: fieldId,
                                                            line: lineId,
                                                            value: request[sublistId][i][fieldId]
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (objRecord.isDynamic) {
                                        objRecord.commitLine({
                                            sublistId: sublistId
                                        });
                                    }
                                }
                            }
                        } else {
                            code = -1;
                            msg = "error, no se encuentra sublista";
                        }
                        lineCount++;
                    } else {
                        if (objFields.indexOf(property) != -1) {
                            log.debug("indexoffields:" + property, "true");
                            var objField = objRecord.getField({
                                fieldId: property
                            });
                            if (objField) {
                                if (objField.type == "summary") {
                                    var _objSubrecord = objRecord.getSubrecord({
                                        fieldId: property
                                    });

                                    objCrawler(_objSubrecord, request[property], true);
                                } else {

                                    if (validateType(request[property])) {
                                        request[property] = parseValues(objField, request[property]);

                                        objRecord.setValue({
                                            fieldId: property,
                                            value: request[property]
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } //try {

        log.debug('save', "save");
        recordId = objRecord.save({
            ignoreMandatoryFields: ignoreMandatoryFields
        }); //}catch(e){}

        if (recordId < 1) {
            code = -2;
            msg = "error al guardar el registro";
        }

        return {
            "code": code,
            "msg": msg,
            "recordId": recordId
        };
    }

    return {
        recordParser: submitFieldsJS
    };
})