$(document).ready(function() {
    loadProducts();

    $('#productForm').submit(function(e) {
        e.preventDefault();
        
        var formData = {
            productName: $('#productName').val(),
            quantity: $('#quantity').val(),
            price: $('#price').val()
        };

        $.ajax({
            url: 'index.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                $('#productForm')[0].reset();
                loadProducts();
            }
        });
    });
});

function loadProducts() {
    $.ajax({
        url: 'index.php?action=getProducts',
        type: 'GET',
        success: function(response) {
            var products = JSON.parse(response);
            var tableHtml = '<table class="table table-striped">';
            tableHtml += '<thead><tr><th>Product Name</th><th>Quantity</th><th>Price</th><th>Datetime</th><th>Total Value</th><th>Actions</th></tr></thead><tbody>';
            
            var totalSum = 0;
            products.forEach(function(product, index) {
                tableHtml += '<tr>';
                tableHtml += '<td>' + product.productName + '</td>';
                tableHtml += '<td>' + product.quantity + '</td>';
                tableHtml += '<td>$' + parseFloat(product.price).toFixed(2) + '</td>';
                tableHtml += '<td>' + product.datetime + '</td>';
                tableHtml += '<td>$' + parseFloat(product.totalValue).toFixed(2) + '</td>';
                tableHtml += '<td><button class="btn btn-sm btn-primary edit-btn" data-index="' + index + '">Edit</button></td>';
                tableHtml += '</tr>';
                totalSum += parseFloat(product.totalValue);
            });

            tableHtml += '<tr class="table-info"><td colspan="4"><strong>Total Sum</strong></td><td><strong>$' + totalSum.toFixed(2) + '</strong></td><td></td></tr>';
            tableHtml += '</tbody></table>';

            $('#productTable').html(tableHtml);

            $('.edit-btn').click(function() {
                var index = $(this).data('index');
                var product = products[index];
                $('#productName').val(product.productName);
                $('#quantity').val(product.quantity);
                $('#price').val(product.price);
            });
        }
    });
}