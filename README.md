# netsuiteCustomSubmitFields

#funciones
1. valida que los campos/sublistas que se quierne poner existan, si no existen ignora la propiedad y pone los que si encuentre.
2. parsea los campos tipo fecha y los tipo moneda.
3. puede selecionar lineas con selectLine, selectNewLine y findSublistLineWithValue.
4. puede introducir valores desde cabecera hasta sublistas de sublist subrecords

# Uso
define(['./lib_recordParser'], function (js) {

    var inventoryassignmentObj = {};
    var inventoryassignmentArr = [];
    var inventorydetailObj = {};
    var itemObj = {};
    var itemArr = [];
    var values = {};
    var obj2createUpdateTransform = {};
    
    /************************
    ejemplo con inventoryDetail
    *****************************/
    
    //si se especifica lineId se agregara el contenido a esa linea con selectLine, si se especifica lineSearch se buscara una linea con findSublistLineWithValue, si no se especifica lineId ni lineSearch se inserta una nueva linea con selectNewLine, estas propiedades funcionan incluso en subrecords
    itemObj["lineSearch"] = {};//opcional
    itemObj["lineSearch"]["fieldId"] = "internalid";//opcional
    itemObj["lineSearch"]["value"] = invoiceId.toString();//opcional
    itemObj["lineId"] = 1;//opcional
    itemObj['quantity'] = 1;
    itemObj["location"] = storeId;
    inventoryassignmentObj['lineId'] = 0;
    inventoryassignmentObj['issueinventorynumber'] = loteSerial[_i7][_j]["inventorynumber"];//issueinventorynumber corresponde al id del campo
    inventoryassignmentObj['binnumber'] = binNumber;
    inventoryassignmentObj['inventorystatus'] = 1;
    inventoryassignmentObj['quantity'] = 1;
    inventoryassignmentArr.push(inventoryassignmentObj);
    inventorydetailObj["inventoryassignment"] = inventoryassignmentArr;
    itemObj["inventorydetail"] = inventorydetailObj;
    itemArr.push(itemObj);
    values['item'] = itemArr;
    obj2createUpdateTransform['values'] = values;
    obj2createUpdateTransform['from'] = "salesorder";// se genera un record.transform porque tiene la propiedad from
    obj2createUpdateTransform['id'] = recordId;//record.load si tiene la propiedad id y no from
    obj2createUpdateTransform['recordType'] = "itemfulfillment";
    obj2createUpdateTransform['isDynamic'] = true;//modo dinamico o standard
    var _response = js.recordParser(obj2createUpdateTransform);
    recordId = _response.recordId;
    
    /*********************************
    ejemplo de una orden de venta
    *********************************/
    
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

    values['entity'] = clientId;//las propiedades correspondel al iddel cmapo
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
    values['item'] = itemArr;//en este caso la propiedad es el nombre de la sublista
    obj2createUpdateTransform['recordType'] = "salesorder";// record.create porque no tiene id
    obj2createUpdateTransform['isDynamic'] = true;
    obj2createUpdateTransform['values'] = values;
    var response = js.recordParser(obj2createUpdateTransform);
    recordId = response.recordId;
});
