from flask import Blueprint, request, jsonify
from src.models.order import Order, db
from flask_cors import cross_origin

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
@cross_origin()
def get_orders():
    """Get all orders"""
    try:
        orders = Order.query.order_by(Order.created_at.desc()).all()
        return jsonify([order.to_dict() for order in orders]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
@cross_origin()
def get_order(order_id):
    """Get a specific order"""
    try:
        order = Order.query.get_or_404(order_id)
        return jsonify(order.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/orders', methods=['POST'])
@cross_origin()
def create_order():
    """Create a new order"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['products', 'total_price', 'customer_name', 'customer_whatsapp']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        order = Order.from_dict(data)
        db.session.add(order)
        db.session.commit()
        
        return jsonify(order.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/orders/<int:order_id>', methods=['PUT'])
@cross_origin()
def update_order(order_id):
    """Update an existing order"""
    try:
        order = Order.query.get_or_404(order_id)
        data = request.get_json()
        
        # Update fields
        if 'status' in data:
            order.status = data['status']
        if 'customer_name' in data:
            order.customer_name = data['customer_name']
        if 'customer_whatsapp' in data:
            order.customer_whatsapp = data['customer_whatsapp']
        if 'total_price' in data:
            order.total_price = data['total_price']
        if 'products' in data:
            order.products = data['products']
        
        db.session.commit()
        return jsonify(order.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/orders/<int:order_id>', methods=['DELETE'])
@cross_origin()
def delete_order(order_id):
    """Delete an order"""
    try:
        order = Order.query.get_or_404(order_id)
        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/orders/stats', methods=['GET'])
@cross_origin()
def get_order_stats():
    """Get order statistics"""
    try:
        total_orders = Order.query.count()
        pending_orders = Order.query.filter_by(status='pending').count()
        completed_orders = Order.query.filter_by(status='completed').count()
        cancelled_orders = Order.query.filter_by(status='cancelled').count()
        
        # Calculate total revenue
        completed_orders_list = Order.query.filter_by(status='completed').all()
        total_revenue = sum(order.total_price for order in completed_orders_list)
        
        stats = {
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'cancelled_orders': cancelled_orders,
            'total_revenue': total_revenue
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

