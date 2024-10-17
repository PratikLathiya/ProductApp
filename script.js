$(document).ready(function() {
    loadProducts();

    $('#productForm').submit(function(e) {
        e.preventDefault();
        
        var formData = {
            productName: $('#productName').val(),
            quantity: $('#quantity').val(),
            price: $('#price').val(),
            editIndex: $('#editIndex').val()
        };

        $.ajax({
            url: 'index.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                $('#productForm')[0].reset();
                $('#editIndex').val('');
                $('#submitBtn').text('Submit');
                $('#cancelBtn').hide();
                loadProducts();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error:", textStatus, errorThrown);
            }
        });
    });

    $('#cancelBtn').click(function() {
        $('#productForm')[0].reset();
        $('#editIndex').val('');
        $('#submitBtn').text('Submit');
        $(this).hide();
    });
});

function loadProducts() {
    $.ajax({
        url: 'index.php?action=getProducts',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var products = Array.isArray(response) ? response : [];
            if (products.length === 0) {
                $('#productTable').html('<p>No products found.</p>');
                return;
            }

            var tableHtml = '<table class="table table-striped">';
            tableHtml += '<thead><tr><th>Product Name</th><th>Quantity</th><th>Price</th><th>Datetime</th><th>Total Value</th><th>Actions</th></tr></thead><tbody>';
            
            var totalSum = 0;
            products.forEach(function(product, index) {
                tableHtml += '<tr>';
                tableHtml += '<td>' + (product.productName || '') + '</td>';
                tableHtml += '<td>' + (product.quantity || 0) + '</td>';
                tableHtml += '<td>$' + (parseFloat(product.price) || 0).toFixed(2) + '</td>';
                tableHtml += '<td>' + (product.datetime || '') + '</td>';
                tableHtml += '<td>$' + (parseFloat(product.totalValue) || 0).toFixed(2) + '</td>';
                tableHtml += '<td><button class="btn btn-sm btn-primary edit-btn" data-index="' + index + '">Edit</button></td>';
                tableHtml += '</tr>';
                totalSum += parseFloat(product.totalValue) || 0;
            });

            tableHtml += '<tr class="table-info"><td colspan="4"><strong>Total Sum</strong></td><td><strong>$' + totalSum.toFixed(2) + '</strong></td><td></td></tr>';
            tableHtml += '</tbody></table>';

            $('#productTable').html(tableHtml);

            $('.edit-btn').click(function() {
                var index = $(this).data('index');
                var product = products[index];
                $('#productName').val(product.productName || '');
                $('#quantity').val(product.quantity || '');
                $('#price').val(product.price || '');
                $('#editIndex').val(index);
                $('#submitBtn').text('Update');
                $('#cancelBtn').show();
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error loading products:", textStatus, errorThrown);
            $('#productTable').html('<p>Error loading products. Please try again.</p>');
        }
    });
}