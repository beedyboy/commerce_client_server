
exports.up = function(knex) {
   return knex
    .schema

    
.createTable( 'chats', function( chatTable ) { 
		chatTable.engine('InnoDB');
		chatTable.increments();   
		chatTable.integer('buyer').unsigned().nullable(); 
		chatTable.integer('seller').unsigned().nullable(); 
		chatTable.text( 'message' ).nullable(); 
		chatTable.enu('sender', ['Buyer', 'Seller', 'Others']).defaultTo('Others'); 
		chatTable.enu('status', ['Read', 'Unread']).defaultTo('Unread');     
		chatTable.string('created_at',  50).nullable();
		chatTable.string('updated_at',  50).nullable();
		chatTable.foreign('buyer').references('id').inTable('logins')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		chatTable.foreign('seller').references('id').inTable('logins')
		.onDelete('CASCADE') .onUpdate('CASCADE');
})

.createTable( 'settings', function( setTable ) { 
		setTable.engine('InnoDB'); 
		setTable.increments();    
		setTable.integer( 'buyer_id' ).unsigned().nullable(); 
		setTable.integer( 'seller_id' ).unsigned().nullable();   
		setTable.string( 'email', 10 ).nullable().defaultTo(true);  
		setTable.string( 'sms', 10 ).nullable().defaultTo(false);  
		setTable.string('created_at',  50).notNullable();
		setTable.string('updated_at',  50).nullable();   
		setTable.foreign('seller_id').references('id').inTable('sellers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		setTable.foreign('buyer_id').references('id').inTable('buyers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
	})

	 

};

exports.down = function(knex) {
  
};
