
exports.up = function(knex) {
   return knex
    .schema

    
.createTable( 'bids', function( bidTable ) { 
		bidTable.engine('InnoDB');
		bidTable.increments();  
		bidTable.integer('product_id').unsigned().nullable(); 
		bidTable.integer('buyer_id').unsigned().nullable(); 
		bidTable.integer('seller_id').unsigned().nullable(); 
		bidTable.string( 'bid_token', 30 ).nullable();     
		bidTable.string('created_at',  50).nullable();
		bidTable.string('updated_at',  50).nullable();
		bidTable.enu('status', ['Ongoing', 'Completed', 'Canceled', 'Deleted']).defaultTo('Ongoing');    
		bidTable.foreign('product_id').references('id').inTable('products')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		bidTable.foreign('seller_id').references('id').inTable('sellers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		bidTable.foreign('buyer_id').references('id').inTable('buyers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
})

.createTable( 'auctions', function( auctionTable ) { 
		auctionTable.engine('InnoDB'); 
		auctionTable.increments();
		auctionTable.string( 'bid_token', 50 ).nullable();   
		auctionTable.integer('bid_id').unsigned().notNullable();  
		auctionTable.integer( 'buyer_id' ).unsigned().nullable(); 
		auctionTable.integer( 'seller_id' ).unsigned().nullable();   
		auctionTable.string( 'quantity', 30 ).nullable().defaultTo(1); 
		auctionTable.string( 'price', 30 ).nullable(); 
		auctionTable.string( 'first_delivery', 50 ).nullable();    
		auctionTable.string( 'second_delivery', 50 ).nullable();    
		auctionTable.string( 'third_delivery', 50 ).nullable(); 
		auctionTable.string( 'within_distance', 30 ).nullable();   
		auctionTable.string( 'within_charge', 30 ).nullable();     
		auctionTable.string( 'beyond_distance', 30 ).nullable();    
		auctionTable.string( 'beyond_charge', 30 ).nullable();   
		auctionTable.string('created_at',  50).notNullable();
		auctionTable.string('updated_at',  50).nullable();
		auctionTable.enu('packed', ['PACKED', 'UNPACKED']).defaultTo('PACKED');
		auctionTable.enu('status', ['Ongoing', 'Successful', 'Canceled']).defaultTo('Ongoing');    
		auctionTable.enu('buyer', ['Accepted',  'Counter', 'Others', 'Buyer Canceled']).defaultTo('Others');    
		auctionTable.enu('seller', ['Accepted', 'Counter', 'Others', 'Seller Canceled']).defaultTo('Others');    
		auctionTable.foreign('bid_id').references('id').inTable('bids')
		.onDelete('CASCADE') .onUpdate('CASCADE');    
		auctionTable.foreign('seller_id').references('id').inTable('sellers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		auctionTable.foreign('buyer_id').references('id').inTable('buyers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
	})

	.createTable( 'transactions', function( transTable ) { 
		transTable.engine('InnoDB'); 
		transTable.increments();
		transTable.integer('auction_id').unsigned().notNullable();   
		transTable.integer( 'buyer_id' ).unsigned().nullable(); 
		transTable.integer( 'seller_id' ).unsigned().nullable(); 
		transTable.string( 'total', 10 ).nullable().defaultTo(0);    
		transTable.string('created_at',  50).notNullable();
		transTable.string('updated_at',  50).nullable();
		transTable.enu('status', ['Paid', 'Failed', 'Others']).defaultTo('Others');    
		transTable.foreign('auction_id').references('id').inTable('auctions')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		transTable.foreign('seller_id').references('id').inTable('sellers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		transTable.foreign('buyer_id').references('id').inTable('buyers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
	})

	.createTable( 'notifications', function( noticeTable ) { 
			noticeTable.engine('InnoDB'); 
			noticeTable.increments(); 
			noticeTable.integer( 'buyer_id' ).unsigned().nullable(); 
			noticeTable.integer( 'seller_id' ).unsigned().nullable();  
			noticeTable.integer( 'notice_id' ).unsigned().nullable();  
			noticeTable.string( 'message', 200 ).nullable();
			noticeTable.string('created_at',  50).notNullable();
			noticeTable.string('updated_at',  50).nullable(); 
			noticeTable.enu('notification_type', ['Bids', 'Auctions', 'Payment', 'Account', 'Others']).defaultTo('Others');    
			noticeTable.foreign('seller_id').references('id').inTable('sellers')
			.onDelete('CASCADE') .onUpdate('CASCADE');
			noticeTable.foreign('buyer_id').references('id').inTable('buyers')
			.onDelete('CASCADE') .onUpdate('CASCADE');
		})

	.createTable( 'readers', function( readTable ) { 
			readTable.engine('InnoDB'); 
			readTable.increments(); 
			readTable.integer( 'notification_id' ).unsigned().nullable(); 
			readTable.enu('sms', ['Yes', 'No']).defaultTo('No'); 
			readTable.enu('mail', ['Yes', 'No']).defaultTo('No'); 
			readTable.enu('read', ['Yes', 'No']).defaultTo('No'); 
			readTable.string('created_at',  50).notNullable();
			readTable.string('updated_at',  50).nullable();    
			readTable.foreign('notification_id').references('id').inTable('notifications')
			.onDelete('CASCADE') .onUpdate('CASCADE');
		})

};

exports.down = function(knex) {
  
};
